import llmex

project_setup = {
    "url": "http://localhost:4000",
    "project_id": "661d277c2d1c48d92d0dcb3a"
}

# checkpoint = "openai-community/gpt2" # here embeddings are at transformer.wte
checkpoint = "vicgalle/gpt2-open-instruct-v1" # here embeddings are at transformer.wte
# checkpoint = "microsoft/phi-1_5" # here embeddings are at model.embed_tokens; This is not fully working yet

device = "cpu"

model_setup = {
    "checkpoint": checkpoint,
    "model_type": "dec",
    # "embeddings": "model.embed_tokens",
    "embeddings": "transformer.wte",
}

run_config = {
    "device": device,
}

model = llmex.from_pretrained(project_setup=project_setup, model_setup=model_setup, run_config=run_config)

from datasets import load_dataset

dataset = load_dataset("truthful_qa", 'multiple_choice')

options = ["A", "B", "C", "D", "E"]
def prompter(question, choices):
    return f"""Please give the correct answer to the following multiple choice question: {question}
    The choices are: {choices}
    Just give A, B, C, D, E or a combination of these as the answer.
    Answer: """

def choices_to_anwers(choices, labels):
    answers = []
    for choice, label in zip(choices, labels):
        if (label == 1):
            answers.append(choice)

    return ",".join(answers) 
    
def choices_to_options(choices):
    return " ".join([f"{options[i]}: {choice}" for i, choice in enumerate(choices)])

def datapoint_to_prompt(point):
    question = point.get("question")
    targets = point.get("mc1_targets")
    target_choices = targets.get("choices")
    labels = targets.get("labels")

    choices = choices_to_options(target_choices)
    
    prompt = prompter(question, choices)
    answers = choices_to_anwers(target_choices, labels)
    
    return prompt, answers
    
# prompt, answer = datapoint_to_prompt(dataset["validation"][3])

predict_config = {
    "max_new_tokens": 10,
    "generate_explanations": False,
}

for i in range(4):
    prompt, answer = datapoint_to_prompt(dataset["validation"][i])
    result = model.predict(prompt, **predict_config)
    print(result)

# result = model.predict(prompt, **predict_config)
# print(result)

# id = "661fc349bbd0ad0d55aea33d"
# res = model.contrastive_explainer(id, "B")
# res = model.saliency_explainer(id)

# TODO: Should be something like this
# project = llmex.Project(project_setup)
# model = llmex.from_pretrained(model_setup=model_setup, run_config=run_config)

# project.load_model(model)