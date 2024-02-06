from transformers import AutoModelForSequenceClassification, PreTrainedTokenizer
from .baseLM import BaseLM
import torch
from torch.nn import functional as F
from captum.attr import InputXGradient
from operator import attrgetter
from typing import Dict, Any
from functools import partial


class ENC_LM(BaseLM):
    def __init__(self, model_checkpoint: str, model: AutoModelForSequenceClassification, 
                 tokenizer: PreTrainedTokenizer, url: str, model_config: dict = {}):
        self.model_type = "enc"
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

    def _tokenize(self, prompt, **tokenizer_kwargs) -> dict:
        print("enc tokenizing")
        return self.tokenizer(prompt, return_tensors="pt", **tokenizer_kwargs)

    def forward(self, inputs):
        output = self.model(**inputs)
        return F.softmax(output.logits, dim=1)
        
    def postprocess_result(self, input, output):
        return output
        # start_idx, end_idx = output
        # r = input["input_ids"][0][start_idx:end_idx + 1]
        # predicted_tokens = self.tokenizer.convert_ids_to_tokens(r, skip_special_tokens=True)
        # predicted_answer = self.tokenizer.convert_tokens_to_string(predicted_tokens)
        # return predicted_answer

    def explain(self, prompt, input, output):

        def model_forward(inp, model, extra_forward_args: Dict[str, Any] = {}):
            output = model(inputs_embeds=inp, **extra_forward_args)
            return F.softmax(output.logits, dim=1)
    
        print("explaining")
        output = torch.argmax(output)

        input_embeds = self.get_input_embeddings(prompt)
        attention_mask = input["attention_mask"]

        forward_func = partial(model_forward, model=self.model, extra_forward_args={"attention_mask": attention_mask})

        lig = InputXGradient(forward_func)
        attributions = lig.attribute(inputs=input_embeds, target=output)
        
        # attributions = attributions.detach().cpu().numpy()
        
        return attributions

    
    # This is for extractive QA
    def predict(self, prompt: str, **kwargs):
        # for k, v in kwargs.items():
        #     print(f"{k}: {v}")

        inputs = self._tokenize(prompt)
        output = self.forward(inputs)
        result = self.postprocess_result(inputs, output)
        print(self.explain(prompt, inputs, output))


        return result
        