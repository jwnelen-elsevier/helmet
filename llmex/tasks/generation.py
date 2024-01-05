import requests
from dataclasses import dataclass

from llmex.baseLLM import BaseLLM
import captum
from captum.attr import LayerIntegratedGradients, TextTokenInput

@dataclass
class TextGenerationLLM(BaseLLM):
    def update_explainer_model(self):
        myobj = {
            'givenname': self.name,
            'modelname': self.model.config.model_type,
            'task': 'generation',
        }
        # posting it to the xai-platform
        url = f"{self.explainer_url}/model"
        requests.post(url, json = myobj)
        print("updated explainer with new model")

    def update_explainer_explainations(self, tokens, attributions):
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
        # "model.transformer.wte.weight")
        ig = LayerIntegratedGradients(m, m.transformer.wte.weight)
        llm_attr = captum.attr.LLMGradientAttribution(ig, t)
        inp = TextTokenInput("Dave lives in Palm Coast , FL and is a lawyer. His personal interests include", 
                             tokenizer=t)

        outputs = m.generate(input_ids, max_length=100, do_sample=True)
        print("generated output")
        decoded_output = t.batch_decode(outputs, skip_special_tokens=True)[0]

        llm_attr.attribute(inp, target=decoded_output)

        return {}


        # outputs = m.generate(input_ids, max_length=100, do_sample=True)
        # print("generated output")

        # fa = FeatureAblation(m)
        # print("created feature ablation")

        # llm_attr = LLMAttribution(fa, t)

        # inp = TextTemplateFeature(input_ids, token_reference_mask=input_ids)
        # print("created input")
        # llm_attr.attribute(inp, target=0)


        # return t.batch_decode(outputs, skip_special_tokens=True)[0]

