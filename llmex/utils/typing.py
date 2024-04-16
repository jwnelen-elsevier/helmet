from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

@dataclass
class Explanation:
    """Generic explanation dataclass"""
    explanation_method: str
    
@dataclass 
class Attribution:
   """Attribution dataclass"""
   attribution: list[float] = field(default_factory=list)

@dataclass
class SaliencyExplanation(Explanation):
    """Saliency Explanation dataclass"""
    input_attributions: Attribution | list[Attribution]
    
@dataclass
class ContrastiveExplanation(Explanation):
    """Contrastive Explanation dataclass"""
    contrastive_input: str
    attributions: Attribution

@dataclass
class AlternativesExplanation(Explanation):
    """Alternatives Explanation dataclass"""
    output_alternatives: list[list[dict[str, float]]]

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