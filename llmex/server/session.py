import uvicorn

def launch_app(port=8000):
    config = uvicorn.Config("llmex.server.server:app", reload=True, port=port, log_level="info")
    server = uvicorn.Server(config)
    server.run()
    return server