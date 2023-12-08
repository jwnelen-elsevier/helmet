# class LM(object):
#     def __init__(self, model: AutoModelForMaskedLM, tokenizer: AutoTokenizer):
#         self.model = model
#         self.tokenizer = tokenizer

#     def predict(self, text):
#         inputs = self.tokenizer(text, return_tensors="pt")
#         mask_token_index = torch.where(inputs["input_ids"][0] == self.tokenizer.mask_token_id)
#         token_logits = self.model(**inputs).logits
#         mask_token_logits = token_logits[0, mask_token_index, :]
#         top_5_tokens = torch.topk(mask_token_logits, 5, dim=1).indices[0].tolist()
#         return self.tokenizer.decode(top_5_tokens[0])

from transformers import AutoModel, AutoTokenizer
import torch
from torch.nn import functional as F

text = "How do I unscrew a screw without a screwdriver?"
document = """Kitchen butter knives can be used in a very similar way to coins. Insert the end of the butter knife into the longer groove and turn counterclockwise to unscrew the screw.
If your butter knife is of low quality and strength or the screw is very tight, then you may bend your butter knife rather than unscrewing the screw. Be aware of this potential damage.[1]"""

class LLM(object):
    def __init__(self, name, model_name, tokenizer_name):
        self.name = name
        self.model = AutoModel.from_pretrained(model_name)
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)

    def describe_model(self) -> None:
        print("model name: ", self.model.config.model_type)
        print("model config: ", self.model.config)
        print("can generate:", self.model.can_generate())
        print("is parallelizable:", self.model.is_parallelizable)

    def tokenize(self, text: str = text) -> torch.Tensor:
        tokens = self.tokenizer.encode(text, return_tensors='pt')
        print("tokens: ", tokens)
        for token in tokens[0]:
            print("token:", self.tokenizer.decode([token]))
        return tokens

    def embed(self, tokens: torch.Tensor) -> torch.Tensor:
        print("embeddings", self.model.embeddings.word_embeddings(tokens))

        for e in self.model.embeddings.word_embeddings(tokens)[0]:
            print("This is an embedding!", e[0])

    def model_forward(self, tokens: torch.Tensor) -> torch.Tensor:
        output = self.model(tokens)
        return F.softmax(output.logits[:, -1, :], dim=-1)

        