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
        # According to Luo and Specia (2024), inputxgradient has a lot of overhead because they also compute the gradients
        # of the input based on a reference input.
        lig = InputXGradient(forward_func)
    else:
        lig = Saliency(forward_func)
    attributions = lig.attribute(inputs=input_embeds, target=output)
    attributions = attributions.detach().cpu().numpy()
    r = attributions[0, :, :]
    attr = r.sum(axis=1)
    attr = wrapper.normalize(attr)

    return attr

# For decoder models, only Layered Integrated Gradients is supported
def compute_gradients_causal(wrapper, prompt, output):
    # LayerIntegratedGradients is only supported for decoder models
    ig = LayerIntegratedGradients(forward_func=wrapper.model, layer=wrapper.model.get_output_embeddings())

    # LLM attribution
    llm_attr = LLMGradientAttribution(ig, wrapper.tokenizer)
    
    # TextTokenInput is the only supported input for LLMGradientAttribution
    input = TextTokenInput(
        prompt, 
        wrapper.tokenizer,
        skip_tokens=[1],  # skip the special token for the start of the text <s>
    )
    
    res = llm_attr.attribute(input, target=output)
    return res.seq_attr.detach().cpu().numpy()