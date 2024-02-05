from transformers import PreTrainedModel, PreTrainedTokenizerBase
from llmex.updater import update_app

class BaseLM():
    def __init__(self, model_checkpoint: str, model: PreTrainedModel, tokenizer: PreTrainedTokenizerBase, model_type: str, url: str):
        self.model_checkpoint = model_checkpoint
        self.model = model
        self.tokenizer = tokenizer
        self.model_type = model_type
        self.platform_url = url
        self.__post_init__()
    
    def __post_init__(self):
        print("post init")
        # self.reset_model()
        self.update_explainer_model()
    
    def update_explainer_model(self):
        b = {
            "model_checkpoint": self.model_checkpoint,
            "model": self.model.config.model_type,
            "tokenizer": self.tokenizer.name_or_path,
            "model_type": self.model_type
        }
        update_app(self.platform_url, "/update_model", b)

    def reset_model(self):
        print('model reset')
        self.model.eval()
        self.model.zero_grad()

    def __call__(self, prompt: str):
        return self.model(prompt)

    # @abc.abstractmethod
    # def predict(self, prompt: str):
    #     pass

    # @abc.abstractmethod
    # def explain(self, prompt: str) -> Explanation:
    #     pass