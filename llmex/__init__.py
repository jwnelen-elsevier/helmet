import transformers
from transformers import AutoTokenizer

import torch
from llmex.model import DEC_LM
from llmex.updater import get_or_create_project

url = "http://localhost:4000"

# Mapping from model_type to model class
model_type_to_class = {
    "enc": transformers.AutoModelForSequenceClassification,
    "dec": transformers.AutoModelForCausalLM,
    "enc-dec": transformers.AutoModelForSeq2SeqLM,
}

model_type_to_implementation = {
    # "enc": ENC_LM,
    # "enc-dec": ENC_DEC_LM,
    "dec": DEC_LM,
}

project_setup = [
    "project_id",
    "platform_url",
]

model_setup_args = [
    "checkpoint",
    "model_type",
    "embeddings",
]

run_config_args = [
    "device"
]

def from_pretrained(project_setup: dict = {}, model_setup:dict = {}, run_config: dict={}):
    print("setting up model")
    platform_url = project_setup.pop("platform_url", url)
    print(platform_url)
    print(project_setup)
    project_id = project_setup.pop("project_id", None)
    
    model_type = model_setup.pop("model_type", None)
    device = run_config.pop("device", "cpu")
    model_checkpoint = model_setup.pop("checkpoint", None)

    assert device in ["cpu", "cuda:0"], AssertionError("device must be either 'cpu' or 'cuda:0'")
    if device == "cuda:0":
        torch.device(device)
        assert torch.cuda.is_available(), AssertionError("cuda is not available")

    assert model_type in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")
    assert project_id is not None, AssertionError("project_id must be specified")

    model_cls = model_type_to_class[model_type]

    hfModel = model_cls.from_pretrained(model_checkpoint, trust_remote_code=True).to(device)
    hfTokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

    modelHelper = model_type_to_implementation[model_type]
    assert modelHelper is not None, AssertionError(f"model_type {model_type} not implemented")

    model = modelHelper(model_checkpoint, hfModel, hfTokenizer, platform_url, project_id, model_setup)
    return model


__all__ = ["from_pretrained", "get_or_create_project"]