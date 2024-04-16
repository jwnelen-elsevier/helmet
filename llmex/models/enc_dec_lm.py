import torch
from transformers import AutoModelForSeq2SeqLM, PreTrainedTokenizer
from operator import attrgetter
from datetime import datetime
from torch.nn import functional as F

from llmex.utils.types import Explanation, Run, ContextInput
from llmex.explainers.gradients import compute_gradient
from llmex.models.base_lm import Base_LM

class ENC_DEC_LM(Base_LM):
    def __init__(self, model_checkpoint: str, model: AutoModelForSeq2SeqLM, 
                 tokenizer: PreTrainedTokenizer, url: str, model_config: dict = {}):
        self.model_type = "enc-dec"
        self.config = model_config

        try:
            assert "embeddings" in model_config, AssertionError("embeddings must be specified in model_config")
            retriever = attrgetter(model_config["embeddings"])
            embeddings = retriever(model).weight
            assert embeddings is not None, AssertionError(f"embeddings {model_config['embeddings']} not found in model")
        except Exception as e:
            print(e)
            raise KeyError("embeddings must be specified in model_config")

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, embeddings)

    def _tokenize(self, input: ContextInput, **tokenizer_kwargs) -> dict:
        tokens = self.tokenizer(input.prompt, input.context, return_tensors="pt", **tokenizer_kwargs)
        return tokens

    def forward(self, inputs):
        return self.model(**inputs)
        
    def postprocess_result(self, output):
        return self.tokenizer.decode(output[0], skip_special_tokens=True)
        # start_idx, end_idx = output
        # r = input["input_ids"][0][start_idx:end_idx + 1]
        # predicted_tokens = self.tokenizer.convert_ids_to_tokens(r, skip_special_tokens=True)
        # predicted_answer = self.tokenizer.convert_tokens_to_string(predicted_tokens)
        # return predicted_answer

    def explain(self, prompt, input, output, gradient_type: str):
        return compute_gradient(self, prompt, input, output, gradient_type)

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

    
    def predict_from_run(self, id: str, **kwargs):
        run = self.get_run(id)
        return self.predict(str(run.input), ground_truth=str(run.groundtruth), **kwargs)

    # This is for abstactive QA
    def predict(self, input: ContextInput, **kwargs):
        inputs = self._tokenize(input)
        output = self.forward(inputs)
        result = self.postprocess_result(output)

        # explanation_type = kwargs.get("explanation_type", "input_x_gradient")
        # print(explanation_type)

        # explanation = self.explain(prompt, inputs, result, explanation_type)
        # exp = self._format_explanation(explanation, explanation_type)
        
        # gt = kwargs.get("ground_truth", None)
        # r = self._format_run(prompt, result, exp, groundtruth=gt)

        # self.update_run(r)
        return result
        