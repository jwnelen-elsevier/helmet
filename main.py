from datasets import load_dataset

import llmex

# checkpoint = "cardiffnlp/twitter-roberta-base-sentiment"
checkpoint = "soleimanian/financial-roberta-large-sentiment"

device = "cpu"
config = {
    "platform_url": "http://localhost:4000",
    "model_type": "enc",
    # "embeddings": "shared"
    "embeddings": "roberta.embeddings.word_embeddings",
    # "special_tokens_mask": true, ?? adapted from Thermostat -> Only needed with Bert, not Roberta
}

model_args = {
    "num_labels": 3,
    "id2label": {0: "negative", 1: "neutral", 2: "positive"},
    "output_attentions": True
}

model = llmex.from_pretrained(checkpoint, config=config, model_args=model_args, device=device)

imdb = load_dataset("imdb")

amount_examples = 3
small_train_dataset = imdb["train"].shuffle(seed=42).select([i for i in list(range(amount_examples))])

# # # # Number 4 gives an error because the text is too long
for i in range(amount_examples):
    example = small_train_dataset[i] # {text, label}
    res = model.predict(example['text'], ground_truth=example['label'])
    print(res)

# id = "65cb2446eb042cc4f86cdcb0"
# res = model.predict_from_run(id, explanation_type="saliency")
# print(res)

# # example = small_train_dataset[5] # {text, label}
# res = model.predict(example['text'], ground_truth=example['label'])
# print(res)

# _id = "65cb17926c3278d34c83a6e4"
# run = model.get_run(_id)
# print(run)
# model.why_not(id=_id, "negative")


# squad = load_dataset("squad")
# example = squad["train"][0]
# result = model.predict(example['question'], example['context'])
