from llmex.llm import LLM, cosine_similarity

text = "How do I unscrew a screw without a screwdriver?"
document = """Kitchen butter knives can be used in a very similar way to coins. Insert the end of the butter knife into the longer groove and turn counterclockwise to unscrew the screw.
If your butter knife is of low quality and strength or the screw is very tight, then you may bend your butter knife rather than unscrewing the screw. Be aware of this potential damage.[1]"""


model_checkpoint = "bert-base-cased"
lm = LLM(name="llm", model_name=model_checkpoint, tokenizer_name=model_checkpoint)

url = "http://localhost:3000"
lm.set_explainer_url(url)
lm.update_explainainer()

# tokens_text = lm.tokenizer.tokenize(text)
# indexed_tokens = lm.tokenizer.convert_tokens_to_ids(tokens_text)

# lm.display_tokenized_text(tokens_text, indexed_tokens)

# tokens_document = lm.tokenizer.tokenize(document)
# index_tokend_document = lm.tokenizer.convert_tokens_to_ids(tokens_document)

# lm.display_tokenized_text(tokens_document, index_tokend_document)

# embeddings_text = lm.embed(text)
# embeddings_document = lm.embed(document)

# # max_tokens = max(len(tokens_text), len(tokens_document))

# # vector_a = embeddings_text[0][0]
# # vector_b = embeddings_document[0][0]
# # len(vector_a)
# # len(vector_b)

# similarity_score = cosine_similarity(embeddings_text, embeddings_document)
# # similarity_score = cosine_similarity(vector_a, vector_b)
# print("similarity_score: ", similarity_score)