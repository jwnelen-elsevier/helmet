import abc
from dataclasses import dataclass
import transformers

@dataclass
class BaseLLM(abc.ABC):
    name: str
    model: transformers.PreTrainedModel
    tokenizer: transformers.PreTrainedTokenizer
    explainer_url: str = None
    device: str = "cpu"

    def __post_init__(self):
        self.reset_model()
        self.update_explainer_model()

    def set_explainer_url(self, url):
        self.explainer_url = url
        print('explainer url set to', url)

    def reset_model(self):      
        self.model.eval()
        self.model.zero_grad()
        print('model reset')

    @abc.abstractmethod
    def update_explainer_model(self):
        pass

    @abc.abstractmethod
    def update_explainer_explainations(self, tokens, attributions):
        pass

    @abc.abstractmethod
    def generate(self, prompt:str):
        pass