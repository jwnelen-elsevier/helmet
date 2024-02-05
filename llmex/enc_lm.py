from transformers import AutoModelForQuestionAnswering, PreTrainedTokenizer
from .baseLM import BaseLM
import torch
from captum.attr import LayerIntegratedGradients

class ENC_LM(BaseLM):
    def __init__(self, model_checkpoint: str, model: AutoModelForQuestionAnswering, tokenizer: PreTrainedTokenizer, url: str):
        self.model_type = "enc"
        self.model = model
        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url)

    def preprocess(self, prompt, paragraph, **tokenizer_kwargs) -> dict:
        return self.tokenizer.encode_plus(text=prompt, text_pair=paragraph, return_tensors="pt", **tokenizer_kwargs)

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
        lig = LayerIntegratedGradients(self.predict, self.model.roberta.embeddings)
        attributions, delta = lig.attribute(inputs=input["input_ids"], baselines=input["input_ids"].clone(), return_convergence_delta=True)
        return attributions

    
    # This is for extractive QA
    def predict(self, prompt: str, context: str, **kwargs):
        inputs = self.preprocess(prompt, context) # {input_ids, attention_mask, token_type_ids}
        output = self.forward(inputs)
        result = self.postprocess_result(inputs, output)
        # explanation = self.explain(inputs, output)

        return result
        