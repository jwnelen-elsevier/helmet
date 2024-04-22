import torch 
from torch.nn import functional as F
from captum.attr import (
    FeatureAblation, 
    LLMAttribution, 
    TextTokenInput, 
)

def calculate_feature_ablation(model, tokenizer, input, target) -> torch.Tensor:
    fa = FeatureAblation(model)
    llm_attr = LLMAttribution(fa, tokenizer)

    inp = TextTokenInput(
        input, 
        tokenizer,
        skip_tokens=[1],  # skip the special token for the start of the text <s>
    )

    attr_res = llm_attr.attribute(inp, target=target) 
    # Normalize it to make it easier to interpret
    attr_res = F.normalize(attr_res.seq_attr, dim=-1)
    return attr_res