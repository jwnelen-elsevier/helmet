from dataclasses import dataclass
import torch 

from llmex.baseLLM import BaseLLM
from llmex.explanation import Explanation
from llmex.explainers.gradients import computeGradients

@dataclass
class TextClassificationLLM(BaseLLM):
    def update_explainer_model(self):
        return super().update_explainer_model()

    def predict(self, prompt:str) -> Explanation:
        model = self.model
        tokenizer = self.tokenizer

        inputs = tokenizer(prompt, return_tensors="pt")

        print("created input_ids")
        with torch.no_grad():
            logits = model(**inputs).logits

        predicted_class_id = logits.argmax().item()
        label = model.config.id2label[predicted_class_id]
        
        return [predicted_class_id, label]

    def explain(self, prompt: str, predicted_class, label) -> Explanation:
       return computeGradients(self.model, self.tokenizer, prompt, predicted_class)
       