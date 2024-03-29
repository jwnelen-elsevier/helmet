# LLMEX

### Use LLMEX in examples

To use llmex in one of the examples perform the following steps:

1. Create venv with `python -m venv .venv`
2. Activate the venv with `source venv/bin/activate`
3. Install LLMEX `pip install -e .`
4. Create a jupyter kernel based on the venv `python -m ipykernel install --user --name venv`

To remove:

1. `deactivate`
2. `jupyter-kernelspec uninstall venv`
3. `rm -r venv`

<!-- To activate a Python virtual environment in Visual Studio Code's terminal, you can use the following command: -->

# Platform

### Backend

```
cd webapp/api
npx nodemon server.js
```

### Frontend

```
cd webapp/client
npm run dev
```

#### MongoDB

Starting a dev server;
`brew services start mongodb-community@7.0`

To stop it again:
`brew services stop mongodb-community@7.0`
