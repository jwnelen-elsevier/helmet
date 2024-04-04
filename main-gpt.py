import llmex

project_setup = {
    "url": "http://localhost:4000",
    "project_id": "660ab0b7c4368d2cd7e713eb"
}

checkpoint = "M4-ai/tau-0.5B" # here embeddings are at model.embed_tokens
device = "cpu"

model_setup = {
    "checkpoint": checkpoint,
    "model_type": "dec",
    "embeddings": "model.embed_tokens"
}

run_config = {
    "device": device,
}

model = llmex.from_pretrained(project_setup=project_setup, model_setup=model_setup, run_config=run_config)
prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

predict_config = {
    "max_new_tokens": 50,
    "generate_explanations": False,
}

# # prompt = "Quote: Imagination is more"
result = model.predict(prompt, **predict_config)

# id = "66069e516455702029922429"
# res = model.predict_from_run(id, explanation_type="saliency")
