from llmex.llm import LLM
import transformers

# T5
# t5-small:
#   embedding: "shared.weight"
#   type: "enc-dec"
#   activations:
#     - "wo" #Note that this will be both encoder and decoder layers
#   token_prefix: "▁"
#   partial_token_prefix: ""

# model_checkpoint = "t5-small"
# type = "enc-dec"
# config = {
#     "model_type": type,
#     "embedding": "shared.weight",
#     "activations": ["wo"],
# }

# m = transformers.AutoModel.from_pretrained(model_checkpoint)
# t = transformers.AutoTokenizer.from_pretrained(model_checkpoint)

# url = "http://localhost:4000"

# lm = LLM(name="LLM Generator", model=m, tokenizer=t, config=config)

# lm.set_explainer_url(url)

# prompt = "Today the weather is really nice and I am planning on "

# # lm.update_explainainer()
# res = lm.generate_truLens()

import torch
import torch.nn as nn
from torch.nn import functional as F

class ToyModel(nn.Module):
    def __init__(self):
        super().__init__()

    def forward(self, input1, input2):
        relu_out1 = F.relu(input1)
        relu_out2 = F.relu(input2)
        return F.relu(relu_out1 - 1 - relu_out2)
    

# m = transformers.AutoModel.from_pretrained("t5-small")
# t = transformers.AutoTokenizer.from_pretrained("t5-small")

# prompt = "Today the weather is really nice and I am planning on "
# input_tokenized_info = t(prompt, return_tensors="pt")

# input_ids, attention_mask = input_tokenized_info["input_ids"], input_tokenized_info["attention_mask"]
# number_input_tokens = len(input_ids[0])

# TODO: https://captum.ai/tutorials/Bert_SQUAD_Interpret

lm = ToyModel()

from captum.attr import IntegratedGradients
model = ToyModel()

# defining and applying integrated gradients on ToyModel and the
ig = IntegratedGradients(model)
attributions, approximation_error = ig.attribute((input1, input2),
                                                 baselines=(baseline1, baseline2),
                                                 method='gausslegendre',
                                                 return_convergence_delta=True)

print(attributions, approximation_error)
