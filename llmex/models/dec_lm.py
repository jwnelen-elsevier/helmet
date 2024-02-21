import transformers
from datetime import datetime

from llmex.models import Base_LM
from llmex.utils.typing import Explanation, Run
from llmex.explainers.perturbation import calculate_perturbation

class DEC_LM(Base_LM):
    def __init__(self, model_checkpoint: str, model: transformers.AutoModelForCausalLM, 
                 tokenizer: transformers.PreTrainedTokenizer, url: str, model_config: dict = {}):
        self.model_type = "dec"
        self.config = model_config

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, None)

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
            do_sample=True, 
            max_new_tokens=max_new_tokens
            # max_length=max_length,
        )[0]
    
    def postprocess_result(self, output):
        # Return back the string
        return self.tokenizer.decode(output, skip_special_tokens=True)
    
    def explain(self, prompt, output):
        return calculate_perturbation(self.model, self.tokenizer, prompt, output)
    
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
            "input": prompt,
            "input_tokens": self.tokenizer.tokenize(prompt),
            "output": result,
            "explanation": explanation,
            **kwargs
        })
    
    def predict(self, prompt, *args, **kwargs):
        eos_token = True
        input = self._tokenize(prompt, eos_token=eos_token)
        output = self.forward(input)
        result = self.postprocess_result(output)

        explanation = self.explain(prompt, output)

        formatted_expl = self._format_explanation(explanation, "perturbation")
        formatted_run = self._format_run(prompt, result, formatted_expl)

        self.update_run(formatted_run)

        # return result, explanation
        return result