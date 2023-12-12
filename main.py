from llmex.llm import LLM

model_checkpoint = "gpt2"
url = "http://localhost:3000"

lm = LLM(name="LLM Generator", model_checkpoint=model_checkpoint, tokenizer_name=model_checkpoint)
lm.set_explainer_url(url)

prompt = "Today the weather is really nice and I am planning on "

# lm.update_explainainer()
res = lm.generate(prompt, True)