from abc import ABC, abstractmethod
from datetime import datetime

import numpy as np
import torch

from helmet.updater import get_run, update_app
from helmet.utils.types import Explanation, Input, Output, Run


class Base_LM(ABC):    
    def __init__(self, model_checkpoint: str, model, tokenizer, 
                 model_type: str, url: str, project_id:str, embeddings, device="cpu"):
        self.model = model
        self.model_checkpoint = model_checkpoint
        self.tokenizer = tokenizer
        self.platform_url = url
        self.project_id = project_id
        self.model_type = model_type
        self.embeddings = embeddings
        self.device = device
        self.__post_init__()
    
    def __post_init__(self):
        self.reset_model()
        print("model loaded")
    
    def _encode_text(self, text: str, **kwargs):
        return self.tokenizer.encode_plus(text, return_tensors="pt", **kwargs)

    def _tokenize(self, text: str, **kwargs):
        t = self.tokenizer(text, return_tensors="pt", **kwargs)
        return t.to(self.device)

    def token_ids_to_string(self, output) -> str:
        # Return back the string
        return self.tokenizer.decode(output, skip_special_tokens=True)

    def get_tokens(self, text: str):
        return self.tokenizer.get_tokens(text)
    
    def to_device(self, tensor):
        return tensor.to(self.device)

    def get_input_embeddings(self, text: str):
        """Extract input embeddings

        :param text str: the string to extract embeddings from.
        """
        item = self._tokenize(text)
        item = {k: v.to(self.device) for k, v in item.items()}
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

    def _format_run(self, prompt, output_str, explanations: list[Explanation], execution_time_in_sec=None, **kwargs) -> Run:
        return Run(**{
            "date": datetime.now(),
            "model_checkpoint": self.model_checkpoint,
            "tokenizer": self.tokenizer.name_or_path,
            "model_type": self.model_type,
            "input": Input(prompt, self.tokenizer.tokenize(prompt)),
            "output": Output(output_str, self.tokenizer.tokenize(output_str)),
            "explanations": explanations,
            "project_id": self.project_id,
            "execution_time_in_sec": execution_time_in_sec,
            **kwargs # e.g. _id or groundtruth
        })

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
    