from datasets import load_dataset

import llmex

checkpoint = "soleimanian/financial-roberta-large-sentiment"

device = "cpu"
config = {
    "platform_url": "http://localhost:4000",
    "project_id": "65dc59b7f3cf2105303bb5a9",
    "model_type": "enc",
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

# Number 4 gives an error because the text is too long
for i in range(amount_examples):
    example = small_train_dataset[i] # {text, label}
    result = model.predict(example["text"], ground_truth=example["label"])

    print("finished", i)

# # id = "65cb2446eb042cc4f86cdcb0"
# res = model.predict_from_run(id, explanation_type="saliency")
# print(res)

