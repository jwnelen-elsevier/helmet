from ferret.explainers.gradient import GradientExplainer

def computeGradients(model, tokenizer, prompt, class_id):
    gradient_explainer = GradientExplainer(model, tokenizer)
    res = gradient_explainer.compute_feature_importance(prompt, class_id)
    return res

