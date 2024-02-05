from transformers import AutoModel, AutoTokenizer

url = "http://localhost:4000"

def update_app(body):
    import requests
    r = requests.post(url + "/update_model", json=body)
    print("updated app", r.status_code)


def load_model(model_checkpoint, device="cpu"):
    model = AutoModel.from_pretrained(model_checkpoint, output_attentions=True).to(device)
    tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)
    b = {
        "model_checkpoint": model_checkpoint,
        "tokenizer_checkpoint": model_checkpoint,
        "model_type": "causal"
    }
    update_app(b)
    return model, tokenizer