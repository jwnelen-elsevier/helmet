import transformers
from transformers import AutoTokenizer

from llmex.enc_lm import ENC_LM

url = "http://localhost:4000"

# Mapping from model_type to model class
model_type_to_class = {
    "enc": transformers.AutoModelForQuestionAnswering,
    "dec": transformers.AutoModelForCausalLM,
    "enc-dec": transformers.AutoModelForSeq2SeqLM,
}

model_type_to_implementation = {
    "enc": ENC_LM,
}

def from_pretrained(model_checkpoint, config={}, device="cpu"):
    print("setting up model")
    
    model_type = config.get("model_type", None)
    assert config["model_type"] in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")

    model_cls = model_type_to_class[model_type]
    hfModel = model_cls.from_pretrained(model_checkpoint)
    hfTokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

    platform_url = config.get("platform_url", url)

    modelHelper = model_type_to_implementation[model_type]
    assert modelHelper is not None, AssertionError(f"model_type {model_type} not implemented")

    model = modelHelper(model_checkpoint, hfModel, hfTokenizer, platform_url)
    return model