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

model_type_to_model_wrapper = {
    # "enc": ENC_LM,
    # "enc-dec": ENC_DEC_LM,
    "dec": DEC_LM,
}


def from_pretrained(model_checkpoint: str, model_type: str, embeddings_path:str, project_id:str,                     device:str, platform_url:str = url, model_config: dict={}):
    """
    Load a model from a checkpoint and return the model object
    Args:
        model_checkpoint (str): The model checkpoint to load
        model_type (str): The type of model to load (enc, dec, enc-dec)
        embeddings_path (str): The embeddings pointer
        project_id (str): The project id to send updates to
        device (str): The device to load the model on (cpu or cuda)
        platform_url (str): The url to send updates to (default is http://localhost:4000)
        model_config (dict): The model configuration
    """
    # First checks
    assert device in ["cpu", "cuda"], AssertionError("device must be either 'cpu' or 'cuda'")
    assert model_type in ["enc", "dec", "enc-dec"], AssertionError("model_type must be either 'enc', 'dec', or 'enc-dec'")
    if model_type in ["enc", "enc-dec"]:
        raise NotImplementedError("model_type 'enc' and 'enc-dec' not implemented yet")
    
    if device == "cuda":
        assert torch.cuda.is_available(), AssertionError("cuda is not available")
        torch.device(device)

    
    print("updates will be sent to", platform_url)
    print("setting up model with config, ", model_config)

    # Getting the Hugginface class
    model_cls = model_type_to_class[model_type]

    # Quantization of the model
    if device == "cuda":
        from transformers import BitsAndBytesConfig
        quantization_config = BitsAndBytesConfig(load_in_4bit=True)
        hfModel = model_cls.from_pretrained(model_checkpoint, trust_remote_code=True, config=quantization_config,
                                            low_cpu_mem_usage=True, device_map="auto", torch_dtype = torch.float16 if device == "cuda" else torch.float32, **model_config)
        hfModel = hfModel.to(device)
        
    else:
        hfModel = model_cls.from_pretrained(model_checkpoint, trust_remote_code=True, **model_config)

    hfTokenizer = AutoTokenizer.from_pretrained(model_checkpoint, **model_config)
    modelHelper = model_type_to_model_wrapper[model_type]

    model_setup = {
        "embeddings": embeddings_path
    }

    model = modelHelper(model_checkpoint, hfModel, hfTokenizer, platform_url, project_id, model_setup, device=device)
    return model


__all__ = ["from_pretrained", "get_or_create_project"]