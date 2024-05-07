import torch
import numpy as np

# Adapted from Interpret-LM
# Adapted from AllenNLP Interpret and Han et al. 2020
def register_embedding_list_hook(model, embedding_layer, embeddings_list):
    def forward_hook(module, inputs, output):
        embeddings_list.append(output.squeeze(0).clone().cpu().detach().numpy())
    handle = embedding_layer.register_forward_hook(forward_hook)
    return handle

def register_embedding_gradient_hooks(model, embedding_layer, embeddings_gradients):
    def hook_layers(module, grad_in, grad_out):
        embeddings_gradients.append(grad_out[0].detach().cpu().numpy())
    hook = embedding_layer.register_full_backward_hook(hook_layers)
    # hook = embedding_layer.register_full_backward_hook(hook_layers)
    return hook

def analyze_token(wrapper, input_ids, correct=None, foil=None):
    # Get model gradients and input embeddings
    model = wrapper.model
    embedding_layer = wrapper.embeddings

    embeddings_list = []
    handle = register_embedding_list_hook(model, embedding_layer, embeddings_list)
    embeddings_gradients = []
    hook = register_embedding_gradient_hooks(model, embedding_layer, embeddings_gradients)
    if correct is None:
        # All is on CPU at this moment
        correct = input_ids[-1]
        input_ids = input_ids[:-1]

    input_ids = torch.tensor(input_ids).unsqueeze(0).to(wrapper.device)
    
    with torch.enable_grad():
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        model.eval()
        for param in model.parameters():
            param.grad = None
        
        A = model(input_ids=input_ids, output_attentions=False)

        # For contrastive explanations
        if foil is not None and correct != foil:
            p = A.logits[0][-1][correct] - A.logits[0][-1][foil].detach().cpu()
        else:
            # for feature attributions
            p = A.logits[0][-1][correct].detach().cpu()

        p.backward()
        
        handle.remove()
        hook.remove()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    return np.array(embeddings_gradients).squeeze(), np.array(embeddings_list).squeeze()

def input_x_gradient(grads, embds, normalize=False):
    input_grad = np.sum(grads * embds, axis=-1).squeeze()

    if normalize:
        norm = np.linalg.norm(input_grad, ord=1)
        input_grad /= norm
        
    return input_grad

# def analyze_token(wrapper, prompt, target):
#     ig = Saliency(forward_func=wrapper.model)

#     # LLM attribution
#     llm_attr = LLMAttribution(ig, wrapper.tokenizer)
    
#     # TextTokenInput is the only supported input for LLMGradientAttribution
#     input = TextTokenInput(
#         prompt, 
#         wrapper.tokenizer,
#         skip_tokens=[1],  # skip the special token for the start of the text <s>
#     )
    
#     res = llm_attr.attribute(input, target=output)
#     return res.seq_attr.detach().cpu().numpy()


#     # # Define the attribution method
#     # lig = Saliency(forward_func)
#     # attributions = lig.attribute(inputs=input_embeds, target=target)
#     # attributions = attributions.detach().cpu().numpy()
#     # r = attributions[0, :, :]
#     # attr = r.sum(axis=1)
#     # attr = wrapper.normalize(attr)

#     # return attr

# # For decoder models, only Layered Integrated Gradients is supported
# def compute_gradients_causal(wrapper, prompt, output):
#     # LayerIntegratedGradients is the? only supported for decoder models
#     # TODO: can we improve this forward function? It is taking a lot of time at the moment
#     ig = LayerIntegratedGradients(forward_func=wrapper.model, layer=wrapper.model.get_output_embeddings())

#     # LLM attribution
#     llm_attr = LLMGradientAttribution(ig, wrapper.tokenizer)
    
#     # TextTokenInput is the only supported input for LLMGradientAttribution
#     input = TextTokenInput(
#         prompt, 
#         wrapper.tokenizer,
#         skip_tokens=[1],  # skip the special token for the start of the text <s>
#     )
    
#     res = llm_attr.attribute(input, target=output)
#     return res.seq_attr.detach().cpu().numpy()

# def compute_gradient(wrapper, prompt, input, output, gradient_type):
#     # TODO: add with torch.no_grad():?

#     def model_forward(inp, model, extra_forward_args: Dict[str, Any] = {}):
#         output = model(input_ids=inp, **extra_forward_args)
#         return F.softmax(output.logits, dim=1)
    
#     input_embeds = wrapper.get_input_embeddings(prompt)
#     attention_mask = input["attention_mask"]

#     forward_func = partial(model_forward, model=wrapper.model, extra_forward_args={"attention_mask": attention_mask})

#     if gradient_type == "input_x_gradient":
#         # According to Luo and Specia (2024), inputxgradient has a lot of overhead because they also compute the gradients
#         # of the input based on a reference input.
#         lig = InputXGradient(forward_func)
#     else:
#         lig = Saliency(forward_func)
#     attributions = lig.attribute(inputs=input_embeds, target=output)
#     attributions = attributions.detach().cpu().numpy()
#     r = attributions[0, :, :]
#     attr = r.sum(axis=1)
#     attr = wrapper.normalize(attr)

#     return attr
