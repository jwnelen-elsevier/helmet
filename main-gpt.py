import llmex
import torch
from transformers import BitsAndBytesConfig

# Load model directly
# from transformers import AutoTokenizer, AutoModelForCausalLM

# tokenizer = AutoTokenizer.from_pretrained("", trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained("microsoft/phi-1_5", trust_remote_code=True)

checkpoint = "openai-community/gpt2"  # embeddings are "transformer.wte"
# p_id = "65df5715dbfd389a9619eabb"
url = "http://localhost:4000"

device = "cpu"

project_setup = {
    "url": url,
    "project_name": "GPT-2 generation",
    "task": "other",
}

id = llmex.get_or_create_project(**project_setup)

config = {
    "platform_url": url,
    "project_id": id,
    "model_type": "dec",
    "embeddings": "transformer.wte"
    # "embeddings": "base_model.embed_tokens.weight"
}

model_args = {
    "output_attentions": True, # does not work for Gemma
    # "quantization_config": bnb_config
}

model = llmex.from_pretrained(checkpoint, config=config, model_args=model_args, device=device)
prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

# prompt = "Quote: Imagination is more"
result = model.predict(prompt, generate_explanations=True)

id = "66069e516455702029922429"
res = model.predict_from_run(id, explanation_type="saliency")
