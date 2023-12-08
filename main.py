from llmex.llm import LLM

text = "How do I unscrew a screw without a screwdriver?"
document = """Kitchen butter knives can be used in a very similar way to coins. Insert the end of the butter knife into the longer groove and turn counterclockwise to unscrew the screw.
If your butter knife is of low quality and strength or the screw is very tight, then you may bend your butter knife rather than unscrewing the screw. Be aware of this potential damage.[1]"""


model_name = "bert-base-cased"
lm = LLM(name="llm", model_name=model_name, tokenizer_name=model_name)

tokens = lm.tokenize()
embeddings = lm.embed(tokens)

lm.describe_model()

# print(lm.model_forward(tokens))