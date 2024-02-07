import requests
import typing
import numpy
import json
from datetime import datetime, date

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, (numpy.int_, numpy.intc, numpy.intp, numpy.int8,
            numpy.int16, numpy.int32, numpy.int64, numpy.uint8,
            numpy.uint16,numpy.uint32, numpy.uint64)):
            return int(obj)
        elif isinstance(obj, (numpy.float_, numpy.float16, numpy.float32, numpy.float64)):
            return float(obj)
        elif isinstance(obj,(numpy.ndarray,)):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def serialize(obj) -> dict:
    """ Serialize the object to a dictionary """
    return json.loads(json.dumps(obj, cls=NumpyEncoder))

def update_app(url: str, route: str, body: dict[str, typing.Any]):
    """ Update the app with the new model and tokenizer. 
    args: 
    url: str: the url of the app
    route: str: the route to update the app (format: /model or /tokenizer) 
    body: dict: the body of the request """
    
    if url is None or route is None:
        raise ValueError(f"url cannot be None url: {url} route:{route}")
    
    r = requests.post(f"{url}{route}", json=serialize(body))
    if r.status_code != 200:
        raise ValueError(f"Failed to update app. Status code: {r.status_code}")
    
    print("updated app")