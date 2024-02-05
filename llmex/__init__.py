import transformers
from transformers import AutoTokenizer

from llmex.baseLM import BaseLM

url = "http://localhost:4000"

# Mapping from model_type to model class
model_type_to_class = {
    "enc": transformers.AutoModelForSequenceClassification,
    "dec": transformers.AutoModelForCausalLM,
    "enc-dec": transformers.AutoModelForSeq2SeqLM,
}

def from_pretrained(model_checkpoint, config={}, device="cpu"):
    print("setting up model")
    assert config["model_type"] in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")
    model_type = config["model_type"]
    model_cls = model_type_to_class[model_type]
    m = model_cls.from_pretrained(model_checkpoint)
    t = AutoTokenizer.from_pretrained(model_checkpoint)

    platform_url = config.get("platform_url", url)

    model = BaseLM(model_checkpoint, m, t, model_type, platform_url)
    return model