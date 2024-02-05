import llmex

checkpoint = "deepset/tinyroberta-squad2"
# checkpoint = "cardiffnlp/twitter-roberta-base-sentiment"

device = "cpu"
config = {
    # "special_tokens_mask": true, ?? adapted from Thermostat -> Only needed with Bert, not Roberta
    "model_type": "enc",
    # "num_labels": 3,
    "platform_url": "http://localhost:4000"
}

model = llmex.from_pretrained(checkpoint, config=config, device=device)

from datasets import load_dataset

# imdb = load_dataset("imdb")
# amount_examples = 10
# small_train_dataset = imdb["train"].shuffle(seed=42).select([i for i in list(range(amount_examples))])

squad = load_dataset("squad")
example = squad["train"][0]

# print(small_train_dataset)

ground_truth = example['answers']['text'][0]

print(ground_truth)
result = model.predict(example['question'], example['context'])
# print(result)
