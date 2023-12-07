# class LM(object):
#     def __init__(self, model: AutoModelForMaskedLM, tokenizer: AutoTokenizer):
#         self.model = model
#         self.tokenizer = tokenizer

#     def predict(self, text):
#         inputs = self.tokenizer(text, return_tensors="pt")
#         mask_token_index = torch.where(inputs["input_ids"][0] == self.tokenizer.mask_token_id)
#         token_logits = self.model(**inputs).logits
#         mask_token_logits = token_logits[0, mask_token_index, :]
#         top_5_tokens = torch.topk(mask_token_logits, 5, dim=1).indices[0].tolist()
#         return self.tokenizer.decode(top_5_tokens[0])


class LLM(object):
    def __init__(self, name):
        self.name = name

    def split(self):
        from langchain.document_loaders import WebBaseLoader
        loader = WebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/")
        data = loader.load()

        from langchain.text_splitter import RecursiveCharacterTextSplitter

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
        all_splits = text_splitter.split_documents(data)

    def predict(self, text):
        print(f"{text}, Hello World 2")

        