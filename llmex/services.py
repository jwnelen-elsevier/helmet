import logging
import os
import signal
import subprocess
import sys
import psutil
from pathlib import Path

PHOENIX_DIR = Path(__file__).resolve().parent
# Server config
SERVER_DIR = PHOENIX_DIR / "server"

class Service:
    """Base class for all services."""

    working_dir = Path.cwd()

    def __init__(self) -> None:
        self.child = self.start()

    def start(self) -> psutil.Popen:
        """Starts the service."""

        self.command = [
            "uvicorn",
            "llmex.server.server:app",
            "--reload",
            "--port",
            "8000",
        ]

        print("starting service", self.command)

        process = psutil.Popen(
            self.command,
            cwd=self.working_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            bufsize=1,
            text=True,
            env={**os.environ},
        )
        return process
    
    def stop(self) -> None:
        """Stops the service."""
        print("stopping service")
        self.child.terminate()