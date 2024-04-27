import torch
import transformers
from transformers import AutoTokenizer

from helmet.model import DEC_LM
from helmet.updater import get_or_create_project

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
    platform_url = project_setup.get("platform_url", url)
    project_id = project_setup.get("project_id", None)
    
    model_type = model_setup.get("model_type", None)
    model_checkpoint = model_setup.get("checkpoint", None)

    device = run_config.get("device", "cpu")

    assert device in ["cpu", "cuda"], AssertionError("device must be either 'cpu' or 'cuda'")

    if device == "cuda":
        assert torch.cuda.is_available(), AssertionError("cuda is not available")
        torch.device(device)
    
    assert model_type in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")
    assert project_id is not None, AssertionError("project_id must be specified")

    print("updates will be sent to", platform_url)
    print("setting up model with config, ", model_setup)

    model_cls = model_type_to_class[model_type]

    # Quantization of the model
    if device == "cuda":
        from transformers import BitsAndBytesConfig
        quantization_config = BitsAndBytesConfig(llm_int8_enable_fp32_cpu_offload=True, load_in_8bit=True)
        hfModel = model_cls.from_pretrained(model_checkpoint, trust_remote_code=True, config=quantization_config, device_map="auto", torch_dtype = torch.float16 if device == "cuda" else torch.float32)
    else:
        hfModel = model_cls.from_pretrained(model_checkpoint, trust_remote_code=True)

    if device == "cuda":
        hfModel = hfModel.to(device)
    
    hfTokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

    modelHelper = model_type_to_implementation[model_type]
    assert modelHelper is not None, AssertionError(f"model_type {model_type} not implemented")

    model = modelHelper(model_checkpoint, hfModel, hfTokenizer, platform_url, project_id, model_setup, device=device)
    return model


__all__ = ["from_pretrained", "get_or_create_project"]