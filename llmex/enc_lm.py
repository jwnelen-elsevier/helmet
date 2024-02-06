from transformers import AutoModelForQuestionAnswering, PreTrainedTokenizer
from .baseLM import BaseLM
import torch
from captum.attr import InputXGradient
from operator import attrgetter
from typing import Dict, Any

class ENC_LM(BaseLM):
    def __init__(self, model_checkpoint: str, model: AutoModelForQuestionAnswering, tokenizer: PreTrainedTokenizer, url: str, model_config: dict = {}):
        self.model_type = "enc"
        self.model = model
        self.config = model_config

        try:
            assert "embeddings" in model_config, AssertionError("embeddings must be specified in model_config")
            retriever = attrgetter(model_config["embeddings"])
            embeddings = retriever(self.model).weight
            assert embeddings is not None, AssertionError(f"embeddings {model_config['embeddings']} not found in model")
        except Exception as e:
            print(e)
            raise KeyError("embeddings must be specified in model_config")

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, embeddings)

    def _tokenize_pair(self, prompt, paragraph, **tokenizer_kwargs) -> dict:
        return self.tokenizer(text=prompt, text_pair=paragraph, return_tensors="pt", **tokenizer_kwargs)

    def _tokenize(self, prompt, **tokenizer_kwargs) -> dict:
        print("enc tokenizing")
        return self.tokenizer(text=prompt, return_tensors="pt", **tokenizer_kwargs)

    def forward(self, inputs):
        with torch.no_grad():
            output = self.model(**inputs) # {start_logits, end_logits}
            start_idx = torch.argmax(output.start_logits)
            end_idx = torch.argmax(output.end_logits)
            return start_idx, end_idx

    def postprocess_result(self, input, output):
        start_idx, end_idx = output
        r = input["input_ids"][0][start_idx:end_idx + 1]
        predicted_tokens = self.tokenizer.convert_ids_to_tokens(r, skip_special_tokens=True)
        predicted_answer = self.tokenizer.convert_tokens_to_string(predicted_tokens)
        return predicted_answer

    def explain(self, input, output):
        def _f(input_ids):
            with torch.no_grad():
                input_embeddings = self._get_input_embeds_from_ids(input_ids)
                output = self.model(inputs_embeds=input_embeddings)
                start_idx = torch.argmax(output.start_logits)
                end_idx = torch.argmax(output.end_logits)
                r = input_ids[0][start_idx:end_idx + 1]
                return r

        print("explaining")
        inputs = input["input_ids"]

        lig = InputXGradient(_f)
        attributions = lig.attribute(inputs=inputs, target=inputs)
        attributions = attributions.detach().cpu().numpy()
        
        return attributions

    
    # This is for extractive QA
    def predict(self, prompt: str, context: str, **kwargs):
        inputs = self._tokenize_pair(prompt, context)
        output = self.forward(inputs)
        result = self.postprocess_result(inputs, output)
        explanation = self.explain(inputs, output)

        return result
        