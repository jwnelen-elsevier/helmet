import helmet

platform_url = "http://localhost:4000"
project_name = "GPT-2 Gen"
project_id = helmet.get_or_create_project(platform_url, project_name, "text_generation")

checkpoint = "vicgalle/gpt2-open-instruct-v1" # here embeddings are at transformer.wte
device = "cpu"
embeddings = "transformer.wte"

model_type = "dec"
# args = {
#     "token": "hf_..."
# }

model = helmet.from_pretrained(checkpoint, model_type, embeddings, project_id, device, platform_url)

predict_config = {
    "max_new_tokens": 5,
    "temperature": 0.7,
    "do_sample": True
}

prompt = "Who is the current president of the United States?"
result, id = model.predict(prompt, generation_args=predict_config)
# model.feature_attribution(id)
model.contrastive_explainer(id, "Clinton")