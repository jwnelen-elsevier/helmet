import requests
import torch

from llmex.baseLLM import BaseLLM
from captum.attr import FeatureAblation , LLMAttribution, TextTemplateInput

class TextGenerationLLM(BaseLLM):
    def update_explainainer(self, tokens, attributions):
        myobj = {
            'name': self.name, 
            'model': self.model.config.model_type,
            'tokenizer': self.tokenizer.name_or_path,
            'tokens': tokens,
            'attributions': attributions
        } 
        # posting it to the xai-platform
        requests.post(self.explainer_url, json = myobj)

    def generate(self, prompt:str):
        t = self.tokenizer
        m = self.model
        device = self.device

        input_ids = t(prompt, return_tensors="pt").input_ids.to(device)
        print("created input_ids")
        
        fa = FeatureAblation(m) 
        llm_attr = LLMAttribution(fa, t) 

        inp = TextTemplateInput( # the text template 
            "{} lives in {}, {} and is a {}. {} personal interests include", 
            # the values of the features 
            ["Dave", "Palm Coast", "FL", "lawyer", "His"],
            # the reference baseline values of the features 
            baselines=["Sarah", "Seattle", "WA", "doctor", "Her"], ) 
        
        attr_restult = llm_attr.attribute(inp)
        print("created attr_restult")
        return attr_restult


        # outputs = m.generate(input_ids, max_length=100, do_sample=True)
        # print("generated output")

        # fa = FeatureAblation(m)
        # print("created feature ablation")

        # llm_attr = LLMAttribution(fa, t)

        # inp = TextTemplateFeature(input_ids, token_reference_mask=input_ids)
        # print("created input")
        # llm_attr.attribute(inp, target=0)


        # return t.batch_decode(outputs, skip_special_tokens=True)[0]

