import requests
import typing
import numpy
import json
from datetime import datetime, date
from llmex.utils.typing import Run
from dacite import from_dict

numbers: tuple = tuple([numpy.int_, numpy.intc, numpy.intp, numpy.int8])
floats: tuple =  tuple([numpy.float_, numpy.float16, numpy.float32, numpy.float64])

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, numbers):
            return int(obj)
        elif isinstance(obj, floats):
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

def get_run(url: str, run_id: str) -> Run | None:
    """ Get the run from the platform """
    if url is None or run_id is None:
        raise ValueError(f"url cannot be None url: {url} run_id:{run_id}")
    final_url = f"{url}/runs/{run_id}"
    # TODO: wrap this in a try statement, so the program can still run after this.
    r = requests.get(final_url)
    if r.status_code != 200:
        raise ValueError(f"Failed to get run. Status code: {r.status_code}")
    
    # pare into the Run object
    try:
        d = r.json()
        form = "%Y-%m-%dT%H:%M:%S.%fZ"
        d["date"] = datetime.strptime(d["date"], form)
        d["output"] = str(d["output"])
        d["groundtruth"] = str(d["groundtruth"])
        return from_dict(data_class=Run, data=d)

    except Exception as e:
        print(e)
        return None