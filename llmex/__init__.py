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
    try: 
        import accelerate
        import bitsandbytes
    except ImportError:
        raise ImportError("accelerate and bitsandbytes must be installed to use llmex")
    

    platform_url = project_setup.get("platform_url", url)
    project_id = project_setup.get("project_id", None)
    
    model_type = model_setup.get("model_type", None)
    model_checkpoint = model_setup.get("checkpoint", None)

    device = run_config.get("device", "cpu")

    assert device in ["cpu", "auto", "cuda:0"], AssertionError("device must be either 'cpu', 'auto', or 'cuda:0'")
    if device == "cuda:0":
        torch.device(device)
        assert torch.cuda.is_available(), AssertionError("cuda is not available")

    assert model_type in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")
    assert project_id is not None, AssertionError("project_id must be specified")

    print("updates will be sent to", platform_url)
    print("setting up model with config", model_setup)

    model_cls = model_type_to_class[model_type]

    hfModel = model_cls.from_pretrained(model_checkpoint, trust_remote_code=True, device_map="auto", load_in_8bit=True)
    hfTokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

    modelHelper = model_type_to_implementation[model_type]
    assert modelHelper is not None, AssertionError(f"model_type {model_type} not implemented")

    model = modelHelper(model_checkpoint, hfModel, hfTokenizer, platform_url, project_id, model_setup)
    return model


__all__ = ["from_pretrained", "get_or_create_project"]