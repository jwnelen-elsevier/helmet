from captum.attr import (
    InputXGradient, Saliency, LayerIntegratedGradients, LLMGradientAttribution, TextTokenInput
)
from typing import Dict, Any
from functools import partial
from torch.nn import functional as F

def compute_gradient(wrapper, prompt, input, output, gradient_type):
    def model_forward(inp, model, extra_forward_args: Dict[str, Any] = {}):
            output = model(inputs_embeds=inp, **extra_forward_args)
            return F.softmax(output.logits, dim=1)
    
    input_embeds = wrapper.get_input_embeddings(prompt)
    attention_mask = input["attention_mask"]

    forward_func = partial(model_forward, model=wrapper.model, extra_forward_args={"attention_mask": attention_mask})

    if gradient_type == "input_x_gradient":
        lig = InputXGradient(forward_func)
    else:
        lig = Saliency(forward_func)
    attributions = lig.attribute(inputs=input_embeds, target=output)
    attributions = attributions.detach().cpu().numpy()
    r = attributions[0, :, :]
    attr = r.sum(axis=1)
    attr = wrapper.normalize(attr)

    return attr
# embed_tokens

# For decoder models, only Layered Integrated Gradients is supported
def compute_gradients_causal(wrapper, prompt, output):
    def model_forward(inp, model, extra_forward_args: Dict[str, Any] = {}):
        max_new_tokens = 5
        return model.generate(
            input_ids=inp["input_ids"],
            use_cache=True, 
            max_new_tokens=max_new_tokens,
            **extra_forward_args
        )
    
    # forward_func = partial(model_forward, model=wrapper.model, extra_forward_args={})

    # LayerIntegratedGradients is only supported for decoder models
    ig = LayerIntegratedGradients(wrapper.model, wrapper._get_embedding_layer())

    # LLM attribution
    llm_attr = LLMGradientAttribution(ig, wrapper.tokenizer)
    
    # TextTokenInput is the only supported input for LLMGradientAttribution
    input = TextTokenInput(
        prompt, 
        wrapper.tokenizer,
        skip_tokens=[1],  # skip the special token for the start of the text <s>
    )
    
    res = llm_attr.attribute(input)
    return res