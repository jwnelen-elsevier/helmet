import transformers
from datetime import datetime
from operator import attrgetter

from llmex.models import Base_LM
from llmex.utils.typing import Explanation, Run, Input
from llmex.explainers.perturbation import calculate_feature_ablation
from llmex.explainers.gradients import compute_gradients_causal

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

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, project_id, None)

    def _tokenize(self, prompt, **tokenizer_kwargs) -> dict:
        has_eos_token = tokenizer_kwargs.get("eos_token", False)
        if has_eos_token:
            self.tokenizer.pad_token = self.tokenizer.eos_token
        return self.tokenizer(prompt, return_tensors="pt")

    def forward(self, inputs, max_new_tokens, **kwargs):
        input_len = len(inputs["input_ids"][0])
        amount_potentials = 5
        print(max_new_tokens)
        
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
        
        o = output.sequences[0][input_len:]
        return o, alternatives_per_token
    
    def postprocess_result(self, output):
        # Return back the string
        return self.tokenizer.decode(output, skip_special_tokens=True)
    
    def explain(self, prompt, output, type: str = "feature_ablation"):
        if type == "gradient":
            return compute_gradients_causal(self, prompt, output)
        return calculate_feature_ablation(self.model, self.tokenizer, prompt, output)
    
    def _format_explanation(self, attr, gradient_type: str) -> Explanation:
        attributions = attr.tolist()
        return Explanation(**{
            "input_attribution": attributions,
            "explanation_method": gradient_type
        })
    
    def _format_run(self, prompt, result, alternatives, explanation) -> Run:
        return Run(**{
            "date": datetime.now(),
            "model_checkpoint": self.model_checkpoint,
            "model": self.model.config.model_type,
            "tokenizer": self.tokenizer.name_or_path,
            "model_type": self.model_type,
            "input": Input(prompt),
            "input_tokens": self.tokenizer.tokenize(prompt),
            "output": result,
            "output_alternatives": alternatives,
            "explanation": explanation,
            "project_id": self.project_id,
        })
    
    def predict_from_run(self, id: str, **kwargs):
        run = self.get_run(id)
        return self.predict(run.input.prompt, **kwargs)

    
    def predict(self, prompt, generate_explanations=True, *args, **kwargs):
        eos_token = True
        max_tokens = kwargs.get("max_new_tokens", 10)
        input = self._tokenize(prompt, eos_token=eos_token)
        output, alternatives = self.forward(input, max_new_tokens=max_tokens)
        result = self.postprocess_result(output)
        formatted_expl = None
        if generate_explanations:
            explanation_type = kwargs.get("explanation_type", "feature_ablation")
            explanation = self.explain(prompt, result, explanation_type)
            formatted_expl = self._format_explanation(explanation, explanation_type)
    
        formatted_run = self._format_run(prompt, result, alternatives, formatted_expl)

        self.update_run(formatted_run)

        # return result, explanation
        return result