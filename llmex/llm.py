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
import requests

text = "How do I unscrew a screw without a screwdriver?"
document = """Kitchen butter knives can be used in a very similar way to coins. Insert the end of the butter knife into the longer groove and turn counterclockwise to unscrew the screw.
If your butter knife is of low quality and strength or the screw is very tight, then you may bend your butter knife rather than unscrewing the screw. Be aware of this potential damage.[1]"""

from scipy.spatial.distance import cosine
import numpy as np

def cosine_similarity(vector1: torch.Tensor, vector2: torch.Tensor) -> float:
    tensor1 = torch.tensor(vector1,requires_grad=True)
    tensor2 = torch.tensor(vector2,requires_grad=True)

    # Ensure that the vectors are numpy arrays
    vector1 = np.array(tensor1.detach().numpy())
    vector2 = np.array(tensor2.detach().numpy())

    # Calculate the cosine similarity
    similarity = 1 - cosine(vector1, vector2)

    return similarity

class LLM(object):
    def __init__(self, name, model_name, tokenizer_name):
        self.name = name
        self.model = AutoModel.from_pretrained(model_name)
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        self.explainer_url = ""

    def set_explainer_url(self, url):
        self.explainer_url = url

    def update_explainainer(self):
        myobj = {'name': self.name, 
                 'model': 'bert-base-cased', 
                 'tokenizer': 'bert-base-cased'}
        x = requests.post(self.explainer_url, json = myobj)
        print(x)

    def describe_model(self) -> None:
        print("model name: ", self.model.config.model_type)
        print("model config: ", self.model.config)
        print("can generate:", self.model.can_generate())
        print("is parallelizable:", self.model.is_parallelizable)

    def tokenize(self, text: str):
        # return self.tokenizer.encode(text, return_tensors='pt')
        return self.tokenizer.encode(text)

    def display_tokenized_text(self, tokens, index_tokens):
        # Display the words with their indeces.
        for tup in zip(tokens, index_tokens):
            print('{:<12} {:>6,}'.format(tup[0], tup[1]))


    def addPadding(self, T: int, tokens: torch.Tensor) -> torch.Tensor:
        padded_tokens = tokens + ['[PAD]' for _ in range(T-len(tokens))]
        print("Padded tokens are \n {} ".format(padded_tokens))
        attn_mask = [ 1 if token != '[PAD]' else 0 for token in padded_tokens  ]
        print("Attention Mask are \n {} ".format(attn_mask))

    def embed(self, tokens: torch.Tensor) -> torch.Tensor:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
        embeddings = model.encode(tokens)
        return embeddings
        # return self.model.embeddings.word_embeddings(tokens)

    def model_forward(self, tokens: torch.Tensor) -> torch.Tensor:
        output = self.model(tokens)
        return F.softmax(output.logits[:, -1, :], dim=-1)

        