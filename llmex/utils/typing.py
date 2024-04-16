from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Explanation:
    """Generic explanation dataclass"""
    explanation_method: str
    def dict(self) -> dict:
        return {
            "explanation_method": self.explanation_method
        }
    
@dataclass 
class Attribution:
   """Attribution dataclass"""
   attribution: list[float]
   def __init__(self, attribution: list[float]):
        self.attribution = attribution

@dataclass
class SaliencyExplanation(Explanation):
    """Saliency Explanation dataclass"""
    input_attributions: Attribution | list[Attribution]
    def __init__(self, input_attribution: Attribution | list[Attribution]):
        self.explanation_method = "saliency"
        self.input_attribution = input_attribution
    
@dataclass
class ContrastiveExplanation(Explanation):
    """Contrastive Explanation dataclass"""
    contrastive_input: str
    attributions: Attribution
    def __init__(self, contrastive_input: str, attributions: Attribution):
        self.explanation_method = "contrastive"
        self.contrastive_input = contrastive_input
        self.attributions = attributions


@dataclass
class AlternativesExplanation(Explanation):
    """Alternatives Explanation dataclass"""
    output_alternatives: list[list[dict[str, float]]] 
    def __init__(self, output_alternatives: list[list[dict[str, float]]]):
        self.explanation_method = "alternatives"
        self.output_alternatives = output_alternatives
    def dict(self) -> dict:
        return {
            "explanation_method": self.explanation_method,
            "output_alternatives": self.output_alternatives
        }

@dataclass  
class Input:
    """Generic Prompt Class"""
    prompt: str
    input_tokens: list[str]
    def dict(self) -> dict:
        return {
            "prompt": self.prompt,
            "input_tokens": self.input_tokens
        }

@dataclass
class ContextInput(Input):
    """Prompt & Context"""
    context: str
    context_tokens: list[str]
    def dict(self) -> dict:
        d = super().dict()
        d["context"] = self.context
        d["context_tokens"] = self.context_tokens
        return d

@dataclass
class Output:
    """Generic output dataclass"""
    output_str: str
    tokens: list[str]
    def dict(self) -> dict:
        return {
            "output_str": self.output_str,
            "tokens": self.tokens
        }

@dataclass
class Run:
    """Generic run dataclass"""
    project_id: str
    date: datetime
    model_checkpoint: str
    tokenizer: str
    model_type: str
    input: Input
    output: Output
    explanations: list[Explanation]

    _id: Optional[str] = None
    groundtruth: Optional[str | list[str]] = None
    execution_time_in_sec: Optional[float] = None
    
    def dict(self) -> dict:
        d = {
            "date": self.date,
            "model_checkpoint": self.model_checkpoint,
            "tokenizer": self.tokenizer,
            "model_type": self.model_type,
            "input": self.input.dict(),
            "output": self.output.dict(),
            "explanations": self.explanations,
            "project_id": self.project_id,
            "execution_time_in_sec": self.execution_time_in_sec
        }
        if self._id is not None:
            d["_id"] = self._id
        return d