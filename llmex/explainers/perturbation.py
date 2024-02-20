from captum.attr import FeatureAblation, LLMAttribution

def calculate_perturbation(model, tokenizer):
    fa = FeatureAblation(model)
    llm_attr = LLMAttribution(fa, tokenizer)
    return llm_attr