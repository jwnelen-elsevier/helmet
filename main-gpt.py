import llmex

project_setup = {
    "url": "http://localhost:4000",
    "project_id": "660ab0b7c4368d2cd7e713eb"
}

# checkpoint = "microsoft/phi-1_5" # here embeddings are at model.embed_tokens
checkpoint = "gpt2" # here embeddings are at model.transformer.wte
device = "cpu"

model_setup = {
    "checkpoint": checkpoint,
    "model_type": "dec",
    "embeddings": "transformer.wte.weight"
}

run_config = {
    "device": device,
}

model = llmex.from_pretrained(project_setup=project_setup, model_setup=model_setup, run_config=run_config)

from datasets import load_dataset

dataset = load_dataset("truthful_qa", 'multiple_choice')
dataset["validation"][1]

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
    
# prompt, answer = datapoint_to_prompt(dataset["validation"][1])

predict_config = {
    "max_new_tokens": 4,
    "generate_explanations": True,
}

prompt = "Quote: Imagination is more"
result = model.predict(prompt, **predict_config)

# id = "66069e516455702029922429"
# res = model.predict_from_run(id, explanation_type="saliency")
