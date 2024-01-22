import torch 
from transformers import BertForQuestionAnswering, AutoTokenizer
from datasets import load_dataset

dataset = load_dataset("squad", split="train")

example = dataset[0]

model_name = "'bert-large-uncased-whole-word-masking-finetuned-squad"

model = BertForQuestionAnswering.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

inputs = tokenizer(
    example['question'], 
    example['context'], 
    return_tensors='pt'
)

inputs = encoding['input_ids']  #Token embeddings
sentence_embedding = encoding['token_type_ids']  #Segment embeddings
tokens = tokenizer.convert_ids_to_tokens(inputs) #input tokens

with torch.no_grad():
    start_scores, end_scores = model(input_ids=torch.tensor([inputs]), token_type_ids=torch.tensor([sentence_embedding]))


start_index = torch.argmax(start_scores)
end_index = torch.argmax(end_scores)

answer = ' '.join(tokens[start_index:end_index+1])



