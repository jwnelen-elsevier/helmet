from transformers import Pipeline
import torch 

class ClassificationLLM():
    def __init__(self, p: Pipeline):
        self.pipeline = p
    
    def generate(self, prompt:str, context: str) -> str:

        model = self.pipeline.model
        tokenizer = self.pipeline.tokenizer
        device = self.pipeline.device

        # input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(device)
        inputs = tokenizer("Hello, my dog is cute", return_tensors="pt")

        print("created input_ids")

        with torch.no_grad():
            logits = model(**inputs).logits

        predicted_class_id = logits.argmax().item()
        print(predicted_class_id)
        # res = model.config.id2label[predicted_class_id]
        # amount = logits.softmax(dim=-1)[0, predicted_class_id].item()

        from captum.attr import ShapleyValues, LLMAttribution
        sv = ShapleyValues(model) 
        llm_attr = LLMAttribution(sv, tokenizer)

        from captum.attr import TextTokenInput
        inp = TextTokenInput(prompt, tokenizer=tokenizer)
        res = llm_attr.attribute(inp, target=predicted_class_id)

        return {}