import transformers
from llmex.models.base_lm import Base_LM

class DEC_LM(Base_LM):
    def __init__(self, model_checkpoint: str, model: transformers.AutoModelForSequenceClassification, 
                 tokenizer: transformers.PreTrainedTokenizer, url: str, model_config: dict = {}):
        self.model_type = "dec"
        self.config = model_config

        super().__init__(model_checkpoint, model, tokenizer, self.model_type, url, None)

    