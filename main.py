from llmex.tasks.generation import TextGenerationLLM 
import transformers

model_checkpoint = "EleutherAI/gpt-neo-1.3B"
device = "cpu"

m = transformers.GPTNeoForCausalLM.from_pretrained(model_checkpoint)
t = transformers.GPT2Tokenizer.from_pretrained(model_checkpoint)

url = "http://localhost:4000"

lm = TextGenerationLLM(name="LLM Generator", model=m, tokenizer=t)
lm.set_explainer_url(url)

prompt = "def hello_world():"

res = lm.generate(prompt)
print(res)

# prompt = "Today the weather is really nice and I am planning on "
# context = "I am planning on going for a walk in the park."

# lm.generate(prompt, context)
# lm.update_explainainer()


# TODO: https://captum.ai/tutorials/Bert_SQUAD_Interpret