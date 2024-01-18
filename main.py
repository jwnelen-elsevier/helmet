from transformers import AutoConfig, AutoModel, AutoTokenizer, AutoModelForSequenceClassification
from llmex.tasks import TextClassificationLLM

import llmex
server = llmex.launch_app(port=8000)


# model_checkpoint = "cardiffnlp/twitter-roberta-base-sentiment-latest"
# # model_checkpoint = "t5-small"
# device = "cpu"
# # text = "This was a masterpiece. Not completely faithful to the books, but enthralling from beginning to end. Might be my favorite of the three."

# model = AutoModelForSequenceClassification.from_pretrained(model_checkpoint, output_attentions=True).to(device)
# tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

# url = "http://localhost:4000"

# model = TextClassificationLLM(name="LLM Generator", model=model, 
#                                     tokenizer=tokenizer, explainer_url=url)

# prefix = "Take a deep breath and work on this problem step-by-step."

# input = {
#     "label": 0,
#     "text": "Hello, my dog is stupid",
# }

# res = model.run(input["text"])
# print(res)

# print("created explainer model")

# classifier = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")
# lm = ClassificationLLM(classifier)

# res = lm.generate(text, None)
# print(res)

# m = transformers.GPTNeoForCausalLM.from_pretrained(model_checkpoint, output_attentions=True).to(device)
# t = transformers.GPT2Tokenizer.from_pretrained(model_checkpoint)




# lm = TextGenerationLLM(name="LLM Generator", model=m, tokenizer=t)
# lm.set_explainer_url(url)

# prompt = "def hello_world():"

# res = lm.generate(prompt)
# print(res)

# prompt = "Today the weather is really nice and I am planning on "
# context = "I am planning on going for a walk in the park."

# lm.generate(prompt, context)
# lm.update_explainainer()


# TODO: https://captum.ai/tutorials/Bert_SQUAD_Interpret