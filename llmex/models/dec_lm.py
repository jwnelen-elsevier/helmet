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
        self.config = model_config

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

    def forward(self, inputs, **kwargs):
        input_len = len(inputs["input_ids"])
        max_new_tokens = 5
        max_length = input_len + max_new_tokens

        return self.model.generate(
            input_ids=inputs["input_ids"], 
            attention_mask=inputs["attention_mask"],
            use_cache=True, 
            max_new_tokens=max_new_tokens
            # max_length=max_length,
        )[0]
    
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
    
    def _format_run(self, prompt, result, explanation, **kwargs) -> Run:
        return Run(**{
            "date": datetime.now(),
            "model_checkpoint": self.model_checkpoint,
            "model": self.model.config.model_type,
            "tokenizer": self.tokenizer.name_or_path,
            "model_type": self.model_type,
            "input": Input(prompt),
            "input_tokens": self.tokenizer.tokenize(prompt),
            "output": result,
            "explanation": explanation,
            "project_id": self.project_id,
            **kwargs
        })
    
    def predict(self, prompt, *args, **kwargs):
        eos_token = True
        input = self._tokenize(prompt, eos_token=eos_token)
        output = self.forward(input)
        result = self.postprocess_result(output)

        explanation_type = kwargs.get("explanation_type", "feature_ablation")
        explanation = self.explain(prompt, result, explanation_type)

        formatted_expl = self._format_explanation(explanation, explanation_type)
        formatted_run = self._format_run(prompt, result, formatted_expl)

        self.update_run(formatted_run)

        # return result, explanation
        return result