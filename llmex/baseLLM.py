from dataclasses import dataclass
from typing import Union
from transformers import PreTrainedModel, AutoModelForSequenceClassification, PreTrainedTokenizer

import abc
import requests
import numpy as np

from .explanation import Explanation


@dataclass
class HookedTransformer(abc.ABC):
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
    
    def run(self, prompt:str):
        res = self.predict(prompt)
        expl = self.explain(prompt, *res)
        
        self.update_explainer_explaination(expl)
        
        return res

    def update_explainer_explaination(self, e: Explanation):
        scores = list(np.float64(e.scores))

        myobj = {
            'name': self.name,
            'model': self.model.config.model_type,
            'tokenizer': self.tokenizer.name_or_path,
            'text': e.text,
            'tokens': e.tokens,
            'attributions': scores
        }

    
        # posting it to the xai-platform
        u = f"{self.explainer_url}/runs"
        requests.post(u, json = myobj)

    def update_explainer_model(self):
        pass

    @abc.abstractmethod
    def predict(self, prompt: str):
        pass

    @abc.abstractmethod
    def explain(self, prompt: str) -> Explanation:
        pass