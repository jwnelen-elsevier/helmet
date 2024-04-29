import helmet

platform_url = "http://localhost:4000"
project_name = "GPT-2 Gen"
projectid = helmet.get_or_create_project(platform_url, project_name, "text_generation")

project_setup = {
    "url": platform_url,
    "project_id": projectid
}

checkpoint = "openai-community/gpt2" # here embeddings are at transformer.wte
# checkpoint = "vicgalle/gpt2-open-instruct-v1" # here embeddings are at transformer.wte

device = "cpu"

model_setup = {
    "checkpoint": checkpoint,
    "model_type": "dec",
    "embeddings": "transformer.wte",
}

model = helmet.from_pretrained(project_setup=project_setup, model_setup=model_setup, run_config={})

predict_config = {
    "max_new_tokens": 1,
}

# prompt = "Sean talks to Veronica and tells her about the"
# prompt = "Sean talks to Veronica and tells him about the"

prompt = "Can you stop the dog from"
# result, id = model.predict(prompt, generation_args=predict_config)
# print(result, id)

# id = "661fc349bbd0ad0d55aea33d"
model.saliency_explainer("662f63d43d29345d2171a907")
# model.contrastive_explainer(id, "crying")
# model.contrastive_explainer(id, "walking")
# model.saliency_explainer(id)

# TODO: Should be something like this
# project = llmex.Project(project_setup)
# model = llmex.from_pretrained(model_setup=model_setup, run_config=run_config)

# project.load_model(model)