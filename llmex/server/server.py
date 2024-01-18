from fastapi import FastAPI
from uvicorn import Config, Server
from typing import Generator
from threading import Thread
from time import sleep, time
# from .session import Session
# from contextlib import asynccontextmanager

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     app.state.session = Session("session")
#     yield

#     app.state.session.close()

app = FastAPI()
# session = Session("session")

# @app.get("/session")
# def get_session():
#     return {"session": session}

@app.get("/")
async def read_root():
    return {"Hello": "World"}

class ThreadServer(Server):
    def __init__(self, app) -> None:
        config = Config(app=app)
        super().__init__(config=config)
        print("server created")

    def install_signal_handlers(self) -> None:
        pass

    def run_in_thread(self) -> Generator[Thread, None, None]:
        """A coroutine to keep the server running in a thread."""
        thread = Thread(target=self.run, daemon=True)
        thread.start()
        print("runned in thread")
        time_limit = time() + 5  # 5 seconds
        try:
            while (
                time() < time_limit
                and thread.is_alive()
                and not self.should_exit
                and not self.started
            ):
                sleep(1e-3)
            if time() >= time_limit and not self.started:
                self.should_exit = True
                raise RuntimeError("server took too long to start")
            yield thread
        finally:
            self.should_exit = True
            thread.join(timeout=5)