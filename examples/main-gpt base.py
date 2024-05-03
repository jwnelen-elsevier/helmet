import helmet

platform_url = "http://localhost:4000"
project_name = "GPT-2 Gen"
project_id = helmet.get_or_create_project(platform_url, project_name, "text_generation")

checkpoint = "vicgalle/gpt2-open-instruct-v1" # here embeddings are at transformer.wte
device = "cpu"
embeddings = "transformer.wte"

model_type = "dec"
args = {
    "token": "hf_..."
}

model = helmet.from_pretrained(checkpoint, model_type, embeddings, project_id, device, platform_url)

predict_config = {
    "max_new_tokens": 5,
}

prompt = "Can you stop the dog from"
result, id = model.predict(prompt, generation_args=predict_config)

prompt = "The president of the United States of America is"
result, id = model.predict(prompt, generation_args=predict_config)

# id = "66326bcd22c8ab06ba6fe191"
model.saliency_explainer(id)
model.contrastive_explainer(id, "Clinton")

# project = llmex.Project(project_setup)
# model = llmex.from_pretrained(model_setup=model_setup, run_config=run_config)

# project.load_model(model)