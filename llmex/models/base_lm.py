import torch
import numpy as np

from abc import ABC, abstractmethod

from llmex.updater import update_app, get_run
from llmex.utils.typing import Run
 
class Base_LM(ABC):    
    def __init__(self, model_checkpoint: str, model, 
                 tokenizer, model_type: str, url: str, project_id:str, embeddings):
        self.model = model
        self.model_checkpoint = model_checkpoint
        self.tokenizer = tokenizer
        self.platform_url = url
        self.project_id = project_id
        self.model_type = model_type
        self.embeddings = embeddings
        self.__post_init__()
    
    def __post_init__(self):
        self.reset_model()
        print("model loaded")
        # self.update_explainer_model()
    
    def _tokenize(self, text: str, **kwargs):
        print('base tokinizer')
        return self.tokenizer(text, return_tensors="pt", **kwargs)

    def get_tokens(self, text: str):
        return self.tokenizer.get_tokens(text)
    
    def get_input_embeddings(self, text: str):
        """Extract input embeddings

        :param text str: the string to extract embeddings from.
        """
        item = self._tokenize(text)
        item = {k: v.to(self.model.device) for k, v in item.items()}
        embeddings = self._get_input_embeds_from_ids(item["input_ids"][0])
        embeddings = embeddings.unsqueeze(0)
        return embeddings
    
    def _get_input_embeds_from_ids(self, ids) -> torch.Tensor:
        return self.model.get_input_embeddings()(ids)

    def get_run(self, run_id: str) -> Run:
        resp = get_run(self.platform_url, run_id)
        if resp is None:
            raise ValueError(f"Run with id {run_id} not found")
        return resp

    def normalize(self, attr):
        l2_norm = np.linalg.norm(attr)
        l2_normalized_matrix = attr / l2_norm
        return l2_normalized_matrix

    def update_run(self, run: Run):
        update_app(self.platform_url, "/runs", run.dict())

    def update_explainer_model(self):
        b = {
            "model_checkpoint": self.model_checkpoint,
            "model": self.model.config.model_type,
            "tokenizer": self.tokenizer.name_or_path,
            "model_type": self.model_type
        }
        update_app(self.platform_url, "/update_model", b)

    def reset_model(self):
        self.model.eval()
        self.model.zero_grad()


    @abstractmethod
    def predict(self, *args, **kwargs):
        pass 
    