import llmex

checkpoint = "openai-community/gpt2"

device = "cpu"
config = {
    "platform_url": "http://localhost:4000",
    "project_id": "65dc59edf3cf2105303bb5aa",
    "model_type": "dec",
    "embeddings": "transformer.wte"
}

model_args = {
    "output_attentions": True
}

model = llmex.from_pretrained(checkpoint, config=config, model_args=model_args, device=device)
prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

result = model.predict(prompt)

# # id = "65cb2446eb042cc4f86cdcb0"
# res = model.predict_from_run(id, explanation_type="saliency")
# print(res)