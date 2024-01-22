import torch 
from transformers import AutoTokenizer, AutoModelForCausalLM
from datasets import load_dataset

dataset = load_dataset("squad")

example = dataset["train"][0]

# from  transformers  import  AutoTokenizer, AutoModelWithLMHead, pipeline

# Encoder-Decoder
model_name = "m3hrdadfi/gpt2-QA"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

question = example['question']
context = example['context']
input = f"question: {question}, context: {context}, answer: "

encoded_input = tokenizer(input,
                            return_tensors='pt',
                            truncation=True)

max_length = len(encoded_input.input_ids[0]) + 10

output = model.generate(input_ids = encoded_input.input_ids, 
                        attention_mask = encoded_input.attention_mask,
                        max_length=max_length,)

# Get the answer
answer = tokenizer.decode(output[0], skip_special_tokens=True)

print(answer)
