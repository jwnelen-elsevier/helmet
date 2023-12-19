import requests
import torch

from llmex.xai_techniques.attribution import compute_attribution_scores_IDG
from llmex.baseLLM import BaseLLM

class FillMaskLLM(BaseLLM):
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
        

    def predict(self, inputs, token_type_ids=None, position_ids=None, attention_mask=None):
        output = self.model(inputs, token_type_ids=token_type_ids,
                 position_ids=position_ids, attention_mask=attention_mask)
        return output.start_logits, output.end_logits

    def construct_input_ref_pair(self, question, text, ref_token_id, sep_token_id, cls_token_id):
        question_ids = self.tokenizer.encode(question, add_special_tokens=False)
        text_ids = self.tokenizer.encode(text, add_special_tokens=False)

        # construct input token ids
        input_ids = [cls_token_id] + question_ids + [sep_token_id] + text_ids + [sep_token_id]

        # construct reference token ids 
        ref_input_ids = [cls_token_id] + [ref_token_id] * len(question_ids) + [sep_token_id] + \
            [ref_token_id] * len(text_ids) + [sep_token_id]

        return torch.tensor([input_ids], device=self.device), torch.tensor([ref_input_ids], device=self.device), len(question_ids)

    def construct_input_ref_token_type_pair(self, input_ids, sep_ind=0):
        seq_len = input_ids.size(1)
        token_type_ids = torch.tensor([[0 if i <= sep_ind else 1 for i in range(seq_len)]], device=self.device)
        ref_token_type_ids = torch.zeros_like(token_type_ids, device=self.device)# * -1
        return token_type_ids, ref_token_type_ids

    def construct_input_ref_pos_id_pair(self, input_ids):
        seq_length = input_ids.size(1)
        position_ids = torch.arange(seq_length, dtype=torch.long, device=self.device)
        # we could potentially also use random permutation with `torch.randperm(seq_length, device=device)`
        ref_position_ids = torch.zeros(seq_length, dtype=torch.long, device=self.device)

        position_ids = position_ids.unsqueeze(0).expand_as(input_ids)
        ref_position_ids = ref_position_ids.unsqueeze(0).expand_as(input_ids)
        return position_ids, ref_position_ids
        
    def construct_attention_mask(self, input_ids):
        return torch.ones_like(input_ids)

    def generate(self, prompt:str, context: str) -> str:
        # Let's compute attributions with respect to the BertEmbeddings layer
        ref_token_id = self.tokenizer.pad_token_id # A token used for generating token reference
        sep_token_id = self.tokenizer.sep_token_id # A token used as a separator between question and text and it is also added to the end of the text.
        cls_token_id = self.tokenizer.cls_token_id # A token used for prepending to the concatenated question-text word sequence

        input_ids, ref_input_ids, sep_id = self.construct_input_ref_pair(prompt, context, ref_token_id, sep_token_id, cls_token_id)
        token_type_ids, ref_token_type_ids = self.construct_input_ref_token_type_pair(input_ids, sep_id)
        position_ids, ref_position_ids = self.construct_input_ref_pos_id_pair(input_ids)
        attention_mask = self.construct_attention_mask(input_ids)

        indices = input_ids[0].detach().tolist()
        all_tokens = self.tokenizer.convert_ids_to_tokens(indices)

        start_scores, end_scores = self.predict(input_ids, token_type_ids=token_type_ids, 
                                        position_ids=position_ids, attention_mask=attention_mask)

        answer = ' '.join(all_tokens[torch.argmax(start_scores) : torch.argmax(end_scores)+1])

        print('Question: ', prompt)
        print('Predicted Answer: ', answer)

        attributions = compute_attribution_scores_IDG(self.model,
                                                      self.model.bert.embeddings, 
                                                      input_ids, 
                                                      ref_input_ids, 
                                                      token_type_ids, 
                                                      position_ids, 
                                                      attention_mask)

        self.update_explainainer(list(all_tokens), attributions)