from dataclasses import dataclass
from datetime import datetime
from typing import Optional
@dataclass
class Explanation:
    """Generic explanation dataclass"""
    explanation_method: str
    input_attribution: list[float] | list[list[float]]

    # TODO: The context probably will be an extension of this explanation class
    # context: str = ""
    # context_tokens: list[str] = []
    # context_attribution: list[float] = []

    def dict(self) -> dict:
        return {
            "explanation_method": self.explanation_method,
            "input_attribution": self.input_attribution
        }

@dataclass  
class Input:
    """Generic Prompt Class"""
    prompt: str

@dataclass
class ContextInput(Input):
    """Prompt & Context"""
    context: str

@dataclass
class Run:
    """Generic run dataclass"""
    date: datetime
    model_checkpoint: str
    model: str
    tokenizer: str
    model_type: str
    input: Input
    input_tokens: list[str]
    output: str | list[str]
    explanation: Explanation
    _id: Optional[str] = None
    
    def dict(self) -> dict:
        d = {
            "date": self.date,
            "model_checkpoint": self.model_checkpoint,
            "model": self.model,
            "tokenizer": self.tokenizer,
            "model_type": self.model_type,
            "input": self.input,
            "input_tokens": self.input_tokens,
            "output": self.output,
            "explanation": self.explanation.dict()
        }
        if self._id is not None:
            d["_id"] = self._id
        return d