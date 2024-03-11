import llmex

# Load model directly
# from transformers import AutoTokenizer, AutoModelForCausalLM

# tokenizer = AutoTokenizer.from_pretrained("", trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained("microsoft/phi-1_5", trust_remote_code=True)

checkpoint = "openai-community/gpt2"  # embeddings are "transformer.wte"
p_id = "65df5715dbfd389a9619eabb"

device = "cpu"
config = {
    "platform_url": "http://localhost:4000",
    "project_id": p_id,
    "model_type": "dec",
    "embeddings": "transformer.wte"
}

model_args = {
    "output_attentions": True
}

model = llmex.from_pretrained(checkpoint, config=config, model_args=model_args, device=device)
# prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

# result = model.predict(prompt)

id = "65ef23fa86ecb9f08ae1d447"
res = model.predict_from_run(id, explanation_type="saliency")
# print(res)