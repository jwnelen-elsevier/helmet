import torch 
from transformers import T5ForConditionalGeneration, AutoTokenizer
from datasets import load_dataset

dataset = load_dataset("squad")

example = dataset["train"][0]
print(example)

# from  transformers  import  AutoTokenizer, AutoModelWithLMHead, pipeline

# Encoder-Decoder
model_name = "MaRiOrOsSi/t5-base-finetuned-question-answering"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

question = example['question']
context = example['context']
input = f"question: {question} context: {context}, answer: "

encoded_input = tokenizer([input],
                             return_tensors='pt',
                             max_length=512,
                             truncation=True)

output = model.generate(input_ids = encoded_input.input_ids, attention_mask = encoded_input.attention_mask)

output = tokenizer.decode(output[0], skip_special_tokens=True)
print(output)
