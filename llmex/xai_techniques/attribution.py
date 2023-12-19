import torch
from captum.attr import LayerIntegratedGradients

def compute_attribution_scores_IDG(model, embeddings, input_ids, ref_input_ids, token_type_ids=None, position_ids=None, attention_mask=None):
    def predict(inputs, token_type_ids=None, position_ids=None, attention_mask=None):
        output = model(inputs, token_type_ids=token_type_ids, position_ids=position_ids, attention_mask=attention_mask)
        
        return output.start_logits, output.end_logits
    
    def summarize_attributions(attributions):
        attributions = attributions.sum(dim=-1).squeeze(0)
        attributions = attributions / torch.norm(attributions)
        return attributions

    def squad_pos_forward_func(inputs, token_type_ids=None, position_ids=None, attention_mask=None, position=0):
        pred = predict(inputs, token_type_ids=token_type_ids, position_ids=position_ids, attention_mask=attention_mask)
        pred = pred[position]
        return pred.max(1).values
    
    lig = LayerIntegratedGradients(squad_pos_forward_func, embeddings)

    attributions_start, delta_start = lig.attribute(inputs=input_ids,
                                baselines=ref_input_ids,
                                additional_forward_args=(token_type_ids, position_ids, attention_mask, 0),
                                return_convergence_delta=True)
    
    attrs = summarize_attributions(attributions_start)
    return list(attrs.detach().numpy())
