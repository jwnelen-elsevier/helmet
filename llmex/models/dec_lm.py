from typing import Tuple
import transformers
import torch
from datetime import datetime
from operator import attrgetter
import time

from llmex.models import Base_LM
from llmex.utils.typing import AlternativesExplanation, Explanation, Run, Input, Output, ContrastiveExplanation, SaliencyExplanation
from llmex.explainers.gradients import analyze_token, input_x_gradient

class DEC_LM(Base_LM):
    def __init__(self, model_checkpoint: str, model: transformers.AutoModelForCausalLM, 
                 tokenizer: transformers.PreTrainedTokenizer, url: str, project_id: str, model_config: dict = {}):
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

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, project_id, embeddings)

    def _tokenize(self, prompt, **tokenizer_kwargs) -> dict:
        has_eos_token = tokenizer_kwargs.get("eos_token", False)
        if has_eos_token:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        return self.tokenizer(prompt, return_tensors="pt")
    
    def token_ids_to_string(self, output) -> str:
        # Return back the string
        return self.tokenizer.decode(output, skip_special_tokens=True)

    def forward(self, inputs, max_new_tokens, **kwargs) -> Tuple[list, AlternativesExplanation]:
        input_len = len(inputs["input_ids"][0])
        amount_potentials = 5
        
        output = self.model.generate(
            input_ids=inputs["input_ids"], 
            attention_mask=inputs["attention_mask"],
            use_cache=True, 
            max_new_tokens=max_new_tokens,
            return_dict_in_generate=True, 
            output_scores=True # this gets the scores, while logits are unprocessed.
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

    
    def explain(self, input, output_token_ids, alternative_output = None, type: str = "gradient") -> Explanation:
        input_ids = input["input_ids"][0]
        attention_mask = input["attention_mask"]
        
        # TODO: Implement contrastive explanation
        # For this, we need to get the alternative output
        # Currently this is just only 1 token.
        if type == "contrastive":
            assert alternative_output is not None, AssertionError("alternative must be specified for contrastive explanation")
            output_id = output_token_ids[0]
            alternative_id = alternative_output["input_ids"][0][0] # not sure why we need this
            saliency_matrix, base_embd_matrix = analyze_token(self, input_ids, attention_mask, correct=output_id, foil=alternative_id)
            gradients = input_x_gradient(saliency_matrix, base_embd_matrix, normalize=True)

            return ContrastiveExplanation(contrastive_input=alternative_output, attributions=gradients)

        # For each produced token, we produce an explanation
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
            print("finished token", start_index - 1 + idx, "of", total_length - start_index - 1)

        return SaliencyExplanation(result)
    
    def _format_run(self, prompt, output_str, explanations: list[Explanation], execution_time_in_sec=None, **kwargs) -> Run:
        return Run(**{
            "date": datetime.now(),
            "model_checkpoint": self.model_checkpoint,
            "tokenizer": self.tokenizer.name_or_path,
            "model_type": self.model_type,
            "input": Input(prompt, self.tokenizer.tokenize(prompt)),
            "output": Output(output_str, self.tokenizer.tokenize(output_str)),
            "explanations": explanations,
            "project_id": self.project_id,
            "execution_time_in_sec": execution_time_in_sec,
            **kwargs # e.g. _id or groundtruth
        })
    
    def contrastive_explainer(self, id: str, alternative_str: str, **kwargs) -> Explanation:
        run = self.get_run(id)
        explanation_type="contrastive"
        input = self._tokenize(run.input.prompt)
        output_token_ids = self.tokenizer.convert_tokens_to_ids(run.output.tokens)
        alts = [expl for expl in run.explanations if isinstance(expl, AlternativesExplanation)][0]
        alternative_token = self._tokenize(alternative_str)

        explanation: Explanation = self.explain(input, output_token_ids, alternative_token, explanation_type)
        # result = self.postprocess_result(output)
        # formatted_run = self._format_run(prompt, output_token_ids, explanations, execution_time)
        formatted_run = self._format_run(run.input.prompt, output_token_ids, [alts, explanation], execution_time_in_sec=None, id=id)
        self.update_run(formatted_run)

        return explanation

    def predict(self, prompt, generate_explanations=False, *args, **kwargs):
        start = time.time()
        eos_token = True
        max_tokens = kwargs.get("max_new_tokens", 10)
        input = self._tokenize(prompt, eos_token=eos_token)
        output_token_ids, alternatives = self.forward(input, max_new_tokens=max_tokens)
        output_str: str = self.token_ids_to_string(output_token_ids)

        explanations = []
        explanations.append(alternatives)

        if generate_explanations:
            explanation_type = kwargs.get("explanation_type", None)
            assert explanation_type is not None, AssertionError("explanation_type must be specified if generate_explanations=True")
            
            explanation: Explanation = self.explain(input, output_token_ids, explanation_type)
            explanations.append(explanation)

        end = time.time()
        execution_time = end - start

        formatted_run = self._format_run(prompt, output_str, explanations, execution_time)

        self.update_run(formatted_run)

        return output_str
    
#     def predict_from_run(self, id: str, **kwargs):
        # run = self.get_run(id)
        # return self.predict(run.input.prompt, **kwargs)


        # if type == "perturbation":
        #     calculate_feature_ablation(self.model, self.tokenizer, prompt, output)
        # return compute_gradients_causal(self, prompt, output)

    # def explain_from_run(self, id: str, explanation_type="gradient", **kwargs):
    #     start = time.time()
    #     run = self.get_run(id)
    #     explanation = self.explain(run.input.prompt, run.output, explanation_type)
    #     formatted_expl = self._format_explanation(explanation, explanation_type)

    #      # record end time
    #     end = time.time()
    #     execution_time = end - start

    #     formatted_run = self._format_run(prompt, result, alternatives, formatted_expl, execution_time_in_sec=execution_time)
    #     self.update_run(formatted_run)
    #     print("Explanation generated and saved successfully!")