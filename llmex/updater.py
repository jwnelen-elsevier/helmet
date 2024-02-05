import requests
import typing
def update_app(url: str, route: str, body: dict[str, typing.Any]):
    """ Update the app with the new model and tokenizer. 
    args: 
    url: str: the url of the app
    route: str: the route to update the app (format: /model or /tokenizer) 
    body: dict: the body of the request """
    
    if url is None or route is None:
        raise ValueError(f"url cannot be None url: {url} route:{route}")
    
    r = requests.post(f"{url}{route}", json=body)
    if r.status_code != 200:
        raise ValueError(f"Failed to update app. Status code: {r.status_code}")
    
    print("updated app")