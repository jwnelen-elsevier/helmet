import transformers
from datetime import datetime

from llmex.models import Base_LM
from llmex.utils.typing import Explanation, Run

class DEC_LM(Base_LM):
    def __init__(self, model_checkpoint: str, model: transformers.AutoModelForCausalLM, 
                 tokenizer: transformers.PreTrainedTokenizer, url: str, model_config: dict = {}):
        self.model_type = "dec"
        self.config = model_config

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, None)

    def _tokenize(self, prompt, **tokenizer_kwargs) -> dict:
        return self.tokenizer(prompt, return_tensors="pt", **tokenizer_kwargs)
    
    def forward(self, inputs):
        return self.model.generate(
            input_ids=inputs["input_ids"], 
            use_cache=True, 
            do_sample=True, 
            max_length=15,
        )[0]
    
    def postprocess_result(self, output):
        # Return back the string
        return self.tokenizer.decode(output, skip_special_tokens=True)
    
    def explain(self, prompt, input, output, gradient_type: str):
        pass
    
    def _format_explanation(self, attr, gradient_type: str) -> Explanation:
        return Explanation(**{
            "input_attribution": list(attr),
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
        input = self._tokenize(prompt)
        output = self.forward(input)
        result = self.postprocess_result(output)

        # explanation_type = kwargs.get("explanation_type", "input_x_gradient")
        # explanation = self.explain(prompt, input, output, explanation_type)
        # formatted_expl = self._format_explanation(explanation, explanation_type)
        # formatted_run = self._format_run(prompt, result, formatted_expl)

        # return result, explanation
        return result