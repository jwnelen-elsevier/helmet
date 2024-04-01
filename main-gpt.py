import llmex

project_setup = {
    "url": "http://localhost:4000",
    "project_id": "660ab0b7c4368d2cd7e713eb"
}

checkpoint = "openai-community/gpt2"  # embeddings are "transformer.wte"
device = "cpu"

model_setup = {
    "checkpoint": checkpoint,
    "model_type": "dec",
    "embeddings": "transformer.wte"
}

run_config = {
    "device": device,
}

model = llmex.from_pretrained(project_setup=project_setup, model_setup=model_setup, run_config=run_config)
prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

predict_config = {
    "generate_explanations": True,
}

# prompt = "Quote: Imagination is more"
result = model.predict(prompt, **predict_config)

id = "66069e516455702029922429"
res = model.predict_from_run(id, explanation_type="saliency")
