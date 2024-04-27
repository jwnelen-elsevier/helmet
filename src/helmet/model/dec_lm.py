import time
from operator import attrgetter
from typing import Tuple

import torch
import transformers

from helmet.explainers.gradients import analyze_token, input_x_gradient
from helmet.model.base_lm import Base_LM
from helmet.utils.constants import ALTERNATIVES, CONTRASTIVE, SALIENCY
from helmet.utils.types import *


class DEC_LM(Base_LM):
    def __init__(self, model_checkpoint: str, model: transformers.AutoModelForCausalLM, 
                 tokenizer: transformers.PreTrainedTokenizer, url: str, project_id: str, model_config: dict = {}, device="cpu"):
        self.model_type = "dec"
        self.model_config = model_config

        try:
            assert "embeddings" in model_config, AssertionError("embeddings must be specified in model_config")
            retriever = attrgetter(model_config["embeddings"])
            embeddings = retriever(model)
            assert embeddings is not None, AssertionError(f"embeddings {model_config['embeddings']} not found in model")
        except Exception as e:
            print(e)
            raise KeyError("embeddings must be specified in model_config")

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, project_id, embeddings, device)
    
    def forward(self, inputs, generation_args, **kwargs) -> Tuple[list, AlternativesExplanation]:
        inputs["input_ids"] = self.to_device(inputs["input_ids"])
        inputs["attention_mask"] = self.to_device(inputs["attention_mask"])

        input_len = len(inputs["input_ids"][0])
        amount_potentials = 5

        output = self.model.generate(
            input_ids=inputs["input_ids"], 
            attention_mask=inputs["attention_mask"],
            return_dict_in_generate=True,
            output_scores=True, # this gets the scores, while logits are unprocessed.
            **generation_args,
            **kwargs
        )
        alternatives_per_token = []
        for i in range(len(output.scores)):
            scores = output.scores[i]
            top_k = scores.topk(amount_potentials, dim=1)
            top_k_scores = top_k.values.detach().flatten().tolist()
            top_k_indices = top_k.indices

            tokens = self.tokenizer.convert_ids_to_tokens(top_k_indices.detach().flatten(), skip_special_tokens=True)
            res = [{"token": token, "score": score} for token, score in zip(tokens, top_k_scores)]
            alternatives_per_token.append(res)
        
        output_token_ids = output.sequences[0][input_len:]
        return output_token_ids, AlternativesExplanation(alternatives_per_token)
    
    def saliency_explainer(self, id: str, **kwargs) -> SaliencyExplanation:
        run: Run = self.get_run(id)
        input = self._encode_text(run.input.prompt)
        output_token_ids = self.tokenizer.convert_tokens_to_ids(run.output.tokens)
        
        input_ids = input["input_ids"][0]
        attention_mask = input["attention_mask"]

        merged = torch.cat((input_ids, torch.tensor(output_token_ids)), 0)
        merged = self.to_device(merged)

        start_index = len(input_ids)
        total_length = len(merged)

        result = []
        for idx in range(start_index, total_length):
            curr_input_ids = merged[:idx]
            output_id = merged[idx]
            base_saliency_matrix, base_embd_matrix = analyze_token(self, curr_input_ids, attention_mask, correct=output_id)
            gradients = input_x_gradient(base_saliency_matrix, base_embd_matrix, normalize=True)
            result.append(gradients)
            print("finished token", idx, "of", total_length)

        explanation = SaliencyExplanation(input_attributions=result)
        run.explanations.append(explanation)

        self.update_run(run)

        return explanation
    
    def contrastive_explainer(self, id: str, alternative_str: str, **kwargs) -> ContrastiveExplanation:
        run: Run = self.get_run(id)
        input = self._tokenize(run.input.prompt)
        alternative_output = self._encode_text(alternative_str)
        output_token_ids = self.tokenizer.convert_tokens_to_ids(run.output.tokens)

        input_ids = input["input_ids"][0]
        attention_mask = input["attention_mask"]
        
        output_id = output_token_ids[0]

        alternative_id = alternative_output["input_ids"][0][0] # not sure why we need this
        saliency_matrix, base_embd_matrix = analyze_token(self, input_ids, attention_mask, correct=output_id, foil=alternative_id)
        gradients = input_x_gradient(saliency_matrix, base_embd_matrix, normalize=True)

        alternative_output_str = self.tokenizer.decode(alternative_id, skip_special_tokens=True)
        
        explanation = ContrastiveExplanation(contrastive_input=alternative_output_str, attributions=gradients)
        run.explanations.append(explanation)

        self.update_run(run)

        return explanation

    def predict(self, prompt, generation_args, generate_explanations=False, groundtruth=None, *args, **kwargs):
        start = time.time()
        input = self._encode_text(prompt)
        output_token_ids, alternatives = self.forward(input, generation_args)
        output_str: str = self.token_ids_to_string(output_token_ids)

        # if generate_explanations:
        #     explanation_type = kwargs.get("explanation_type", None)
        #     assert explanation_type is not None, AssertionError("explanation_type must be specified if generate_explanations=True")
            
        #     explanation: Explanation = self.explain(input, output_token_ids, explanation_type)
        #     explanations.append(explanation)
        print("Predicted output:", output_str)
        end = time.time()
        execution_time = end - start

        formatted_run = self._format_run(prompt, output_str, [alternatives], execution_time, groundtruth=groundtruth)

        self.update_run(formatted_run)

        return output_str