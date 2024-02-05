import llmex

checkpoint = "deepset/tinyroberta-squad2"
device = "cpu"
config = {
    "model_type": "enc",
    "platform_url": "http://localhost:4000"
}

# model, tokenizer = llmex.load_model(checkpoint, device)
model = llmex.from_pretrained(checkpoint, config=config, device=device)

# print(session.state.get_session())
# import torch
# from captum.attr import (
#     FeatureAblation, 
#     ShapleyValues,
#     LayerIntegratedGradients, 
#     LLMAttribution, 
#     LLMGradientAttribution, 
#     TextTokenInput, 
#     TextTemplateInput,
#     ProductBaselines,
# )

# import time
# def print_time():
#     t = time.localtime()
#     current_time = time.strftime("%H:%M:%S", t)
#     print(current_time)

# print_time()
# checkpoint = "gpt2"
# device = "cpu"


# model_checkpoint = "cardiffnlp/twitter-roberta-base-sentiment-latest"
# model_checkpoint = "t5-small"

# model_checkpoint = "TinyLlama/TinyLlama-1.1B-Chat-v1.0" # For Text Generation

# device = "cpu"
# text = "This was a masterpiece. Not completely faithful to the books, but enthralling from beginning to end. Might be my favorite of the three."

# import bitsandbytes as bnb




# model = AutoModelForCausalLM.from_pretrained(model_checkpoint, config=create_bnb_config())
# tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

# # Needed for LLaMA tokenizer
# tokenizer.pad_token = tokenizer.eos_token

# eval_prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

# model_input = tokenizer(eval_prompt, return_tensors="pt")
# model.eval()
# with torch.no_grad():
#     output_ids = model.generate(model_input["input_ids"], max_new_tokens=15)[0]
#     response = tokenizer.decode(output_ids, skip_special_tokens=True)
#     print(response)

# print("Starting Attribution")
# fa = FeatureAblation(model)
# llm_attr = LLMAttribution(fa, tokenizer)

# inp = TextTemplateInput(
#     template="{} lives in {}, {} and is a {}. {} personal interests include", 
#     values=["Dave", "Palm Coast", "FL", "lawyer", "His"],
# )

# target = "playing golf, hiking, and cooking."




# print_time()
# attr_res = llm_attr.attribute(inp, target=target)

# print_time()

# attr_res.plot_token_attr(show=True)