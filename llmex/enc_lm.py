from transformers import AutoModelForQuestionAnswering, PreTrainedTokenizer
from .baseLM import BaseLM
import torch

class ENC_LM(BaseLM):
    def __init__(self, model_checkpoint: str, model: AutoModelForQuestionAnswering , tokenizer: PreTrainedTokenizer, url: str):
        self.model_type = "enc"
        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url)

    def encode(self, prompt, paragraph):
        return self.tokenizer.encode_plus(text=prompt, text_pair=paragraph, return_tensors="pt")


    def predict(self, prompt: str, context: str, **kwargs):
        encoding = self.encode(prompt, context)
        input_ids = encoding["input_ids"]
        attention_mask = encoding["attention_mask"]

        with torch.no_grad():
            output = self.model(input_ids=input_ids, attention_mask=attention_mask)
        
        start_idx = torch.argmax(output.start_logits)
        end_idx = torch.argmax(output.end_logits)
        
        r = input_ids[0][start_idx:end_idx + 1]
        predicted_tokens = self.tokenizer.convert_ids_to_tokens(r)
        predicted_answer = self.tokenizer.convert_tokens_to_string(predicted_tokens)
        print(predicted_answer)