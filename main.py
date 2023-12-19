from llmex.tasks.fillmask import FillMaskLLM 
from transformers import BertForQuestionAnswering, BertTokenizer

model_checkpoint = "anas-awadalla/bert-small-pretrained-finetuned-squad"
device = "cpu"

# m = transformers.AutoModel.from_pretrained(model_checkpoint)
# t = transformers.AutoTokenizer.from_pretrained(model_checkpoint)
m = BertForQuestionAnswering.from_pretrained(model_checkpoint)
t = BertTokenizer.from_pretrained(model_checkpoint)

url = "http://localhost:4000"

lm = FillMaskLLM(name="LLM Generator", model=m, tokenizer=t)
lm.set_explainer_url(url)

prompt = "Today the weather is really nice and I am planning on "
context = "I am planning on going for a walk in the park."

lm.generate(prompt, context)
# lm.update_explainainer()


# TODO: https://captum.ai/tutorials/Bert_SQUAD_Interpret