import torch.nn as nn
import transformers
from transformers import PreTrainedModel, AutoModelForSequenceClassification, PreTrainedTokenizer

class HookedTransformer(PreTrainedModel, url):
    def __init__(self, str):
        super().__init__()
        self.model = str

    #private function
    def _update_it(self):
        pass