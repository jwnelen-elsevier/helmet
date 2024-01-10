import abc
from .explanation import Explanation
from dataclasses import dataclass
from typing import Union
from transformers import PreTrainedModel, AutoModelForSequenceClassification, PreTrainedTokenizer

@dataclass
class BaseLLM(abc.ABC):
    name: str
    model: Union[PreTrainedModel, AutoModelForSequenceClassification]
    tokenizer: PreTrainedTokenizer
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
    def update_explainer_explainations(self, exp: Explanation):
        pass

    @abc.abstractmethod
    def run(self, prompt:str):
        pass