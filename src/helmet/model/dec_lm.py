import time
from operator import attrgetter
from typing import Tuple
import numpy as np

import torch
import transformers

from helmet.explainers.gradients import analyze_token, input_x_gradient
from helmet.model.base_lm import Base_LM
from helmet.utils.types import *


class DEC_LM(Base_LM):
    def __init__(self, 
                 model_checkpoint: str, 
                 model: transformers.AutoModelForCausalLM, 
                 tokenizer: transformers.PreTrainedTokenizer, 
                 url: str, 
                 project_id: str, 
                 model_config: dict = {}, 
                 device="cpu"):
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
    
    def forward(self, inputs, generation_args, **kwargs) -> Tuple[list, CertaintyExplanation]:
        input_len = len(inputs["input_ids"][0])

        generated_outputs = self.model.generate(
            **inputs, 
            return_dict_in_generate=True,
            output_scores=True, # this gets the scores
            **generation_args,
            **kwargs
        )
        
        transition_scores = self.model.compute_transition_scores(generated_outputs.sequences, generated_outputs.scores, normalize_logits=True)
        gen_sequences = generated_outputs.sequences[:, input_len:]
        certainties = [float(np.exp(score.cpu().numpy())) for score in transition_scores[0]]

        outs = gen_sequences[0].detach().cpu().numpy() 

        return outs, CertaintyExplanation(certainties)
    
    def predict(self, prompt, generation_args, groundtruth=None, *args, **kwargs):
        start = time.time()
        input = self._encode_text(prompt)
        input_str = self.token_ids_to_string(input["input_ids"][0])
        
        print("Processed input:", input_str)
        
        output_token_ids, certainties = self.forward(input, generation_args)
        output_str: str = self.token_ids_to_string(output_token_ids)

        print("Output:", output_str)
        
        end = time.time()
        execution_time = end - start

        formatted_run = self._format_run(input_str, output_str, [certainties], execution_time, groundtruth=groundtruth)

        id = self.update_run(formatted_run)

        return output_str, id

    def feature_attribution(self, id: str, **kwargs) -> FeatureAttributionExplainer:
        run: Run = self.get_run(id)
        input = self._encode_text(run.input.prompt) #on cuda
        output_token_ids = self.tokenizer.convert_tokens_to_ids(run.output.tokens) #on cpu
        output_token_ids = torch.tensor(output_token_ids).to(self.device)
        input_ids = input["input_ids"][0]
        attention_mask = input["attention_mask"]

        merged = torch.cat((input_ids, output_token_ids), 0)

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

        explanation = FeatureAttributionExplainer(input_attributions=result)
        run.explanations.append(explanation)

        id = self.update_run(run)

        return explanation
    
    def contrastive_explainer(self, id: str, alternative_str: str, **kwargs) -> ContrastiveExplanation:
        run: Run = self.get_run(id)
        input = self._tokenize(run.input.prompt)
        alternative_output = self._encode_text(alternative_str)
        output_token_ids = self.tokenizer.convert_tokens_to_ids(run.output.tokens)

        input_ids = self.to_device(input["input_ids"][0])
        attention_mask = self.to_device(input["attention_mask"])
        
        output_id = output_token_ids[0]

        alternative_id = alternative_output["input_ids"][0]
        if len(alternative_id) > 1:
            print("Warning: alternative output has more than one token, using the first one")
            alternative_id = alternative_id[0]
        saliency_matrix, base_embd_matrix = analyze_token(self, input_ids, attention_mask, correct=output_id, foil=alternative_id)
        gradients = input_x_gradient(saliency_matrix, base_embd_matrix, normalize=True)

        alternative_output_str = self.tokenizer.decode(alternative_id, skip_special_tokens=True)
        
        explanation = ContrastiveExplanation(contrastive_input=alternative_output_str, attributions=gradients)
        run.explanations.append(explanation)

        id = self.update_run(run)

        return explanation
        

