from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List, Dict

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
    def dict(self) -> dict:
        return {
            "prompt": self.prompt
        }

@dataclass
class ContextInput(Input):
    """Prompt & Context"""
    context: str
    def dict(self) -> dict:
        d = super().dict()
        d["context"] = self.context
        return d

@dataclass
class Output:
    """Generic output dataclass"""
    sequences: list[str]
    def dict(self) -> dict:
        return {
            "sequences": self.sequences
        }
@dataclass
class Run:
    """Generic run dataclass"""
    project_id: str
    date: datetime
    model_checkpoint: str
    model: str
    tokenizer: str
    model_type: str
    input: Input
    input_tokens: list[str]
    output: str | list[str]
    output_alternatives: List[List[Dict[str, float]]] | list
    explanation: Explanation | None = None
    _id: Optional[str] = None
    groundtruth: Optional[str | list[str]] = None
    execution_time_in_sec: Optional[int] = None
    
    def dict(self) -> dict:
        d = {
            "date": self.date,
            "model_checkpoint": self.model_checkpoint,
            "model": self.model,
            "tokenizer": self.tokenizer,
            "model_type": self.model_type,
            "input": self.input.dict(),
            "input_tokens": self.input_tokens,
            "output": self.output,
            "output_alternatives": self.output_alternatives,
            "explanation": self.explanation.dict() if self.explanation is not None else None,
            "project_id": self.project_id,
            "execution_time_in_sec": self.execution_time_in_sec
        }
        if self._id is not None:
            d["_id"] = self._id
        if self.groundtruth is not None:
            d["groundtruth"] = self.groundtruth
        return d