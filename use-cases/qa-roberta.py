import torch 
from transformers import AutoModelForQuestionAnswering, AutoTokenizer
from datasets import load_dataset

dataset = load_dataset("squad")

example = dataset["train"][0]
print(example)

model_name = "deepset/roberta-base-squad2"

model = AutoModelForQuestionAnswering.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

inputs = tokenizer(
    example['question'], 
    example['context'], 
    return_tensors='pt'
)

with torch.no_grad():
    outputs = model(**inputs)

start_idx = torch.argmax(outputs.start_logits)
end_idx = torch.argmax(outputs.end_logits)


r = inputs['input_ids'][0][start_idx:end_idx + 1]
predicted_answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(r))

# Print the answer
print(f"Answer: {predicted_answer}")