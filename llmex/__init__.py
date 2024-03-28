import transformers
from transformers import AutoTokenizer

import torch
from llmex.models import ENC_LM, ENC_DEC_LM, DEC_LM

url = "http://localhost:4000"

# Mapping from model_type to model class
model_type_to_class = {
    "enc": transformers.AutoModelForSequenceClassification,
    "dec": transformers.AutoModelForCausalLM,
    "enc-dec": transformers.AutoModelForSeq2SeqLM,
}

model_type_to_implementation = {
    "enc": ENC_LM,
    "enc-dec": ENC_DEC_LM,
    "dec": DEC_LM,
}

def from_pretrained(model_checkpoint, config:dict = {}, model_args: dict={}, device="cpu"):
    print("setting up model")
    
    model_type = config.pop("model_type", None)
    platform_url = config.pop("platform_url", url)
    project_id = config.pop("project_id", None)

    assert device in ["cpu", "cuda:0"], AssertionError("device must be either 'cpu' or 'cuda:0'")
    if device == "cuda:0":
        torch.device(device)
        assert torch.cuda.is_available(), AssertionError("cuda is not available")

    assert model_type in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")
    assert project_id is not None, AssertionError("project_id must be specified")

    model_cls = model_type_to_class[model_type]

    hfModel = model_cls.from_pretrained(model_checkpoint, **model_args).to(device)
    hfTokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

    modelHelper = model_type_to_implementation[model_type]
    assert modelHelper is not None, AssertionError(f"model_type {model_type} not implemented")

    model = modelHelper(model_checkpoint, hfModel, hfTokenizer, platform_url, project_id, config)
    return model