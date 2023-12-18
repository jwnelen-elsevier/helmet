import torch
from torch.nn import functional as F
import requests

class LLM(object):
    def __init__(self, name, model, tokenizer, config):
        self.name = name
        self.model = model
        self.tokenizer = tokenizer
        self.explainer_url = ""
        self.last_prompt = ""
        self.output = ""
        self.attritbutions = []
        self.config = config

    def set_explainer_url(self, url):
        self.explainer_url = url

    def update_explainainer(self):
        myobj = {
            'name': self.name, 
            'model': self.model.config.model_type,
            'tokenizer': self.tokenizer.name,
            'tokens': self.last_prompt,
            'attributions': self.attributions
        } 
        # posting it to the xai-platform
        requests.post(self.explainer_url, json = myobj)
        

    def generate(self, prompt: str, update_explainainer: bool) -> str:
        model_type = self.config.model_type
        assert model_type in ['enc-dec', 'causal'], f"generate method not supported for model type '{model_type}'"

        # Collecting needed information
        top_k = 5
        top_p = 0.95

        input_tokenized_info = self.tokenizer(prompt, return_tensors="pt")
        input_ids, attention_mask = input_tokenized_info["input_ids"], input_tokenized_info["attention_mask"]
        number_input_tokens = len(input_ids[0])

        if model_type == 'enc-dec':
            model_kwargs = self.model._prepare_encoder_decoder_kwargs_for_generation(input_ids, {})
            decoder_input_ids, model_kwargs = self.model._prepare_decoder_input_ids_for_generation(
                batch_size=input_ids.shape[0],
                model_input_name=self.model.main_input_name,
                model_kwargs=model_kwargs,
                decoder_start_token_id=self.model.config.decoder_start_token_id,
                bos_token_id=self.model.config.bos_token_id,
            )
        else:
            decoder_input_ids = None

        output = self.model.generate(
            input_ids=input_ids, 
            attention_mask=attention_mask,
            top_p=top_p,
            top_k=top_k,
            do_sample=True,
            return_dict_in_generate=True,
            output_scores=True
        )
        
        prediction_logits, prediction_ids = [], []
        if output.__class__.__name__.endswith("EncoderDecoderOutput"):
            prediction_ids, prediction_scores = output.sequences[0][1:], output.scores

        elif output.__class__.__name__.endswith("DecoderOnlyOutput"):
            prediction_ids, prediction_scores = output.sequences[0][number_input_tokens:], output.scores

        
        assert prediction_ids != []
        assert len(prediction_ids) == len(prediction_scores)
        
        for pred_id, scores in zip(prediction_ids, prediction_scores):
            prediction_logits.append(scores[0][pred_id])

        print("Output tokens are \n {} ".format(output))

        model_embeddings = self.model.transformer.shared.weight # This highly depends on the model type
        activations = self.model.transformer.wo # This highly depends on the model type

        for pred_index, prediction_id in enumerate(prediction_ids):
            # Get the input embeddings
            input_embeddings = model_embeddings[input_ids[0]]

        print("Decoder input ids are \n {} ".format(decoder_input_ids))

        o = self.tokenizer.decode(output[0])
        # if update_explainainer:
        #     self.last_prompt = prompt
        #     self.output = o
        #     self.update_explainainer()
        #     print('Updated explainer')
        return o
    

    def tokenize(self, text: str):
        return self.tokenizer(text, return_tensors="pt")["input_ids"]

    def display_tokenized_text(self, tokens, index_tokens):
        # Display the words with their indeces.
        for tup in zip(tokens, index_tokens):
            print('{:<12} {:>6,}'.format(tup[0], tup[1]))


    def addPadding(self, T: int, tokens: torch.Tensor) -> torch.Tensor:
        padded_tokens = tokens + ['[PAD]' for _ in range(T-len(tokens))]
        print("Padded tokens are \n {} ".format(padded_tokens))
        attn_mask = [ 1 if token != '[PAD]' else 0 for token in padded_tokens  ]
        print("Attention Mask are \n {} ".format(attn_mask))

    def embed(self, tokens: torch.Tensor) -> torch.Tensor:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer('multi-qa-MiniLM-L6-cos-v1')
        embeddings = model.encode(tokens)
        return embeddings
        # return self.model.embeddings.word_embeddings(tokens)

    def model_forward(self, tokens: torch.Tensor) -> torch.Tensor:
        output = self.model(tokens)
        return F.softmax(output.logits[:, -1, :], dim=-1)

        