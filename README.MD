<h2 align="center">
<img width="50%" src="https://github.com/jwnelen-elsevier/llmex/blob/main/helmet_logo.png?raw=true" />
</h2>

# HELMET ⛑️ (Human Evaluated large Language Model Explainability Tool)

## Tool

### Use LLMEX in examples

To use llmex in one of the examples perform the following steps:

1. Create venv with `python -m venv .venv`
2. Activate the venv with `source .venv/bin/activate`
3. Install LLMEX from source (from git, when located in the home folder of llmex `pip install -e .`
4. Install jupyter notebook `pip install jupyterlab`
5. Create a jupyter kernel based on the venv `python -m ipykernel install --user --name venv`
6. Open Jupyter notebook `jupyter lab`

To remove:

1. `deactivate`
2. `jupyter-kernelspec uninstall venv`
3. `rm -r venv`

<!-- To activate a Python virtual environmen    t in Visual Studio Code's terminal, you can use the following command: -->

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

## MongoDB

Starting a dev server;
`brew services start mongodb-community@7.0`

To stop it again:
`brew services stop mongodb-community@7.0`
