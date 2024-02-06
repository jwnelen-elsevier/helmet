from dataclasses import dataclass

@dataclass 
class Explanation:
    """Generic explanation dataclass"""

    input: str
    input_tokens: list[str]
    input_attribution: list[float]

    # TODO: The context probably will be an extension of this explanation class
    # context: str = ""
    # context_tokens: list[str] = []
    # context_attribution: list[float] = []

    output_text: str
    # output_tokens: list[str]
    
    explanation_method: str
    def dict(self) -> dict:
        return {
            "input": self.input,
            "input_tokens": self.input_tokens,
            "input_attribution": self.input_attribution,
            "output_text": self.output_text,
            # "output_tokens": self.output_tokens,
            "explanation_method": self.explanation_method
        }
