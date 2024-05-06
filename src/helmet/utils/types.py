from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from helmet.utils.constants import FEATURE_ATTRIBUTION, ALTERNATIVES, CONTRASTIVE, CERTAINTY

@dataclass 
class Attribution:
   """Attribution dataclass"""
   attribution: list[float] = field(default_factory=list)

@dataclass
class Explanation:
    """Generic explanation dataclass"""
    explanation_method: str

@dataclass
class FeatureAttributionExplainer(Explanation):
    """Saliency Explanation dataclass"""
    input_attributions: Attribution | list[Attribution]
    def __init__(self, input_attributions: Attribution | list[Attribution]):
        self.input_attributions = input_attributions
        super().__init__(FEATURE_ATTRIBUTION)
    
@dataclass
class ContrastiveExplanation(Explanation):
    """Contrastive Explanation dataclass"""
    contrastive_input: str
    attributions: Attribution
    def __init__(self, contrastive_input: str, attributions: Attribution):
        self.contrastive_input = contrastive_input
        self.attributions = attributions
        super().__init__(CONTRASTIVE)

@dataclass
class AlternativesExplanation(Explanation):
    """Alternatives Explanation dataclass"""
    output_alternatives: list[list[dict[str, float]]]
    def __init__(self, output_alternatives: list[list[dict[str, float]]]):
        self.output_alternatives = output_alternatives
        super().__init__(ALTERNATIVES)

@dataclass
class CertaintyExplanation(Explanation):
    """Certainty Explanation dataclass"""
    certainties: list[float]
    def __init__(self, certainties: list[float]):
        self.certainties = certainties
        super().__init__(CERTAINTY)

explanation_name_to_class = {
    ALTERNATIVES: AlternativesExplanation,
    CONTRASTIVE: ContrastiveExplanation,
    FEATURE_ATTRIBUTION: FeatureAttributionExplainer,
    CERTAINTY: CertaintyExplanation
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
    groundtruth: Optional[str] = None
    custom_args: Optional[dict] = None
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
        if self.groundtruth is not None:
            d["groundtruth"] = self.groundtruth
        if self.custom_args is not None:
            d["custom_args"] = self.custom_args
        return d
    
