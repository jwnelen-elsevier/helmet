import requests
import typing
import numpy
import json
from datetime import datetime, date
from dateutil import parser

from dacite import from_dict
from helmet.utils.types import Run, Explanation, AlternativesExplanation, ContrastiveExplanation, SaliencyExplanation, explanation_name_to_class
from dataclasses import asdict

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
        elif isinstance(obj, Explanation):
            return asdict(obj)
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
    try :
        r = requests.post(f"{url}{route}", json=serialize(body))
        r.raise_for_status()
        print("updated app, result: ", r.json())
        
    except Exception as e:
        print(e)
        raise ValueError(f"Failed to get app. Is it running? url: {url} route: {route}")
    

def get_run(url: str, run_id: str) -> Run | None:
    """ Get the run from the platform """
    if url is None or run_id is None:
        raise ValueError(f"url cannot be None url: {url} run_id:{run_id}")
    final_url = f"{url}/runs/{run_id}"

    try:
        r = requests.get(final_url)
        r.raise_for_status()
    except Exception as e:
        print(e)
        raise ValueError(f"Failed to get run. Is the platform running? url: {final_url}")
    
    try:
        d = r.json()
        d["date"] = parser.parse(d["date"])
        # form = "%Y-%m-%dT%H:%M:%S.%fZ"
        # d["date"] = datetime.strptime(d["date"], form)

        expls = []
        for exp in d["explanations"]:
            expl_method = exp.pop("explanation_method")
            expl_class = explanation_name_to_class[expl_method]
            expls.append(expl_class(**exp))

        d["explanations"] = expls
        return from_dict(data_class=Run, data=d)

    except Exception as e:
        print(e)
        return None
    
def get_or_create_project(url: str, project_name: str, task: str) -> str:
    """ Get or create the project """
    if url is None or project_name is None or task is None:
        raise ValueError(f"url cannot be None url: {url} project_name:{project_name} description:{task}")
    final_url = f"{url}/project"

    try:
        r = requests.get(final_url)
        r.raise_for_status()
    except Exception as e:
        print(e)
        raise ValueError(f"Failed to get projects. Is the platform running? url: {final_url}")
    
    projects = r.json()
    for project in projects:
        if project["projectName"] == project_name:
            print("found project with the same name. Using the same project.")
            return project["_id"].__str__()
    

    print("creating new project")
    r = requests.post(final_url, json={"projectName": project_name, "task": task})
    if r.status_code != 200:
        raise ValueError(f"Failed to create project. Status code: {r.status_code}")
    
    return r.json()["_id"]