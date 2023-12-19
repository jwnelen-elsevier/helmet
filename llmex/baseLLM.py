from abc import ABC, abstractmethod
import transformers

class BaseLLM(ABC):
    def __init__(self, name, model: transformers.PreTrainedModel, tokenizer: transformers.PreTrainedTokenizer, device="cpu"):
        self.name = name
        self.model = model
        self.tokenizer = tokenizer
        self.device = device
        self.explainer_url = ""
        # self.reset_model()
        super().__init__()

    def set_explainer_url(self, url):
        self.explainer_url = url

    def reset_model(self):      
        self.model.eval()
        self.model.zero_grad()

    @abstractmethod
    def update_explainainer(self, tokens, attributions):
        pass

    @abstractmethod
    def generate(self, inputs, context):
        pass