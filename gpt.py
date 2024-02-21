import transformers

from operator import attrgetter

from captum.attr import LayerIntegratedGradients, LLMGradientAttribution, TextTokenInput

from typing import Dict, Any
from functools import partial
from torch.nn import functional as F

checkpoint = "openai-community/gpt2"

model = transformers.AutoModelForCausalLM.from_pretrained(checkpoint)
tokenizer = transformers.AutoTokenizer.from_pretrained(checkpoint)

embeddings_str = "transformer.wte"

try:
    retriever = attrgetter(embeddings_str)
    embeddings = retriever(model).weight
    assert embeddings is not None, AssertionError(f"embeddings not found in model")
except Exception as e:
    print(e)
    raise KeyError("embeddings must be specified in model_config")

prompt = "Dave lives in Palm Coast, FL and is a lawyer. His personal interests include"

input = tokenizer(prompt, return_tensors="pt")
max_new_tokens = 5
output = model.generate(
    input_ids=input["input_ids"],
    attention_mask=input["attention_mask"],
    use_cache=True, 
    max_new_tokens=max_new_tokens
)[0]
print(output)

decoded = tokenizer.decode(output, skip_special_tokens=True)
print(decoded)

# For decoder models, only Layered Integrated Gradients is supported
def compute_gradients_causal(m, t, e, p, o):
    
    def model_forward(inp, mod, extra_forward_args: Dict[str, Any] = {}):
        max_new_tokens = 5
        return mod.generate(
            input_ids=inp["input_ids"],
            use_cache=True, 
            max_new_tokens=max_new_tokens,
            **extra_forward_args
    )
   
    forward_func = partial(model_forward, mod=m, extra_forward_args={})

    # LayerIntegratedGradients is only supported for decoder models
    ig = LayerIntegratedGradients(forward_func=forward_func, layer=m.get_output_embeddings())

    # LLM attribution
    llm_attr = LLMGradientAttribution(ig, t)
    
    # TextTokenInput is the only supported input for LLMGradientAttribution
    input = TextTokenInput(
        p, 
        t,
        skip_tokens=[1],  # skip the special token for the start of the text <s>
    )
    
    res = llm_attr.attribute(inp=input, target=o)
    return res

compute_gradients_causal(model, tokenizer, embeddings, prompt, output)