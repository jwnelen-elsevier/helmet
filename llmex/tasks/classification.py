from dataclasses import dataclass
from llmex.baseLLM import BaseLLM
from llmex.explanation import Explanation
from ferret.explainers.gradient import GradientExplainer

import torch 
import requests
import numpy as np

@dataclass
class TextClassificationLLM(BaseLLM):

    def update_explainer_explainations(self, e: Explanation):
        scores = list(np.float64(e.scores))

        myobj = {
            'name': self.name,
            'model': self.model.config.model_type,
            'tokenizer': self.tokenizer.name_or_path,
            'text': e.text,
            'tokens': e.tokens,
            'attributions': scores
        }
    
        # posting it to the xai-platform
        requests.post(self.explainer_url, json = myobj)
    
    def update_explainer_model(self):
        return super().update_explainer_model()

    def run(self, prompt:str, label: int) -> Explanation:
        model = self.model
        tokenizer = self.tokenizer

        inputs = tokenizer(prompt, return_tensors="pt")

        print("created input_ids")

        with torch.no_grad():
            logits = model(**inputs).logits

        predicted_class_id = logits.argmax().item()
        print(predicted_class_id)
        res = model.config.id2label[predicted_class_id]
        print(res)

        gradient_explainer = GradientExplainer(model, tokenizer)
        res = gradient_explainer.compute_feature_importance(prompt, predicted_class_id)

        self.update_explainer_explainations(res)
        # from captum.attr import ShapleyValues, LLMAttribution
        # sv = ShapleyValues(model) 
        # llm_attr = LLMAttribution(sv, tokenizer)

        # from captum.attr import TextTokenInput
        # inp = TextTokenInput(prompt, tokenizer=tokenizer)
        # res = llm_attr.attribute(inp, target=predicted_class_id)

        return res