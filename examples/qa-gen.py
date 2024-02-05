import requests
import inseq
from transformers import AutoTokenizer, AutoModelForCausalLM
from datasets import load_dataset

dataset = load_dataset("squad", split="train")

device = "cpu"
example = dataset[0]

model_id = "gpt2"
# model_id = "mistralai/Mixtral-8x7B-v0.1" #Freaking 5*18=90GB model
# model_id = "microsoft/DialoGPT-small" # Isnot working
# model_id = "microsoft/phi-2" # Is not working 
# model_id = "bigscience/bloom-560m" # Is working

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id)

question = example['question']
context = example['context']
input = f"Give answer to the following question: {question}, Make use of the following context: {context}, answer: "

tokens = tokenizer(input, return_tensors="pt").to(device)
answer = model.generate(**tokens)
answer = tokenizer.batch_decode(answer)
answer = answer[0].replace("<pad>", "").replace("</s>", "").strip()
print(answer)
