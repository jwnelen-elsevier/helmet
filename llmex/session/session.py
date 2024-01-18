import os
import tempfile
from pathlib import Path
from llmex.services import Service
from llmex.server.server import ThreadServer
from fastapi import FastAPI


PHOENIX_DIR = Path(__file__).resolve().parent
# Server config
SERVER_DIR = PHOENIX_DIR / "server"

class ThreadSession():
    def __init__(self) -> None:
        self.app = Service()
        print("app created")
        self.server = ThreadServer(self.app)
        print("server created", self.server)
        self.server.run_in_thread()
        print("End of init")


def launch_app() -> ThreadSession:
    session = ThreadSession()
    return session
    # return app

# def launch_app(port:int=8000) -> Server:
#     config = uvicorn.Config("llmex.server.server:app", reload=True, port=port, log_level="info")
#     server = uvicorn.Server(config)
#     server.run()
#     return server

# def create_app(port:int=8000) -> Server:

#     return server




