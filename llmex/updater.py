import requests
import typing
import numpy
import json

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        print(obj, type(obj))
        if isinstance(obj, (numpy.int_, numpy.intc, numpy.intp, numpy.int8,
            numpy.int16, numpy.int32, numpy.int64, numpy.uint8,
            numpy.uint16,numpy.uint32, numpy.uint64)):
            return int(obj)
        elif isinstance(obj, (numpy.float_, numpy.float16, numpy.float32, numpy.float64)):
            return float(obj)
        elif isinstance(obj,(numpy.ndarray,)):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)
    

def update_app(url: str, route: str, body: dict[str, typing.Any]):
    """ Update the app with the new model and tokenizer. 
    args: 
    url: str: the url of the app
    route: str: the route to update the app (format: /model or /tokenizer) 
    body: dict: the body of the request """
    
    if url is None or route is None:
        raise ValueError(f"url cannot be None url: {url} route:{route}")
    
    try:
        dump = json.dumps(body, cls=NumpyEncoder)
    except Exception as e:
        raise ValueError(f"Failed to serialize body to json. Error: {e}")
    
    # print("SENDING REQUEST", dump)

    # TODO: Decide on body or dump version 
    r = requests.post(f"{url}{route}", json=body, headers={"Content-Type": "application/json"})
    if r.status_code != 200:
        raise ValueError(f"Failed to update app. Status code: {r.status_code}")
    
    print("updated app")