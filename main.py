import llmex

checkpoint = "deepset/tinyroberta-squad2"
device = "cpu"
config = {
    # "special_tokens_mask": true, ?? adapted from Thermostat
    "model_type": "enc",
    "platform_url": "http://localhost:4000"
}

# model, tokenizer = llmex.load_model(checkpoint, device)
model = llmex.from_pretrained(checkpoint, config=config, device=device)

from datasets import load_dataset

dataset = load_dataset("squad")

example = dataset["train"][0]

model.predict(example['question'], example['context'])
