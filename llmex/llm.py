from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from torch.nn import functional as F
import requests

class LLM(object):
    def __init__(self, name, model_checkpoint, tokenizer_name):
        self.name = name
        self.model_checkpoint = model_checkpoint
        self.tokenizer_checkpoint = tokenizer_name
        self.model = AutoModelForCausalLM.from_pretrained(model_checkpoint)
        self.tokenizer = AutoTokenizer.from_pretrained(tokenizer_name)
        self.explainer_url = ""
        self.last_prompt = ""
        self.output = ""

    def set_explainer_url(self, url):
        self.explainer_url = url

    def update_explainainer(self):
        myobj = {'name': self.name, 
                 'model': self.model_checkpoint,
                 'tokenizer': self.tokenizer_checkpoint,
                'prompt': self.last_prompt,
                'output': self.output
        } 
        requests.post(self.explainer_url, json = myobj)

    def generate(self, prompt: str, update_explainainer: bool) -> str:
        print("Generating text for prompt: ", prompt)
        inputs = self.tokenize(prompt)
        print("Input tokens are \n {} ".format(inputs))
        outputs = self.model.generate(inputs, max_length=250, do_sample=True, top_p=0.95, top_k=60)
        print("Output tokens are \n {} ".format(outputs))
        o = self.tokenizer.decode(outputs[0])
        if update_explainainer:
            self.last_prompt = prompt
            self.output = o
            self.update_explainainer()
            print('Updated explainer')
        return o
    

    def tokenize(self, text: str):
        return self.tokenizer(text, return_tensors="pt")["input_ids"]

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

        