<p align="center">
<img  width="75%" src="docs/helmet.png" />
</p>

### HELMET: Human Evaluated large Language Model Explainability Tool

[![PyPI version](https://badge.fury.io/py/helmet.svg)](https://badge.fury.io/py/helmet)

## Contents

- [Installation helmet](#pypi-installation)
- [Configuration Details](#configuration-files)
- [Features](#features)
- [Install Helmet from source](#install-from-source)
- [Deploy helmet-platform (local)](#running-webapp-locally)
- [License](#license)

## Pypi Installation

```console
pip install helmet
```

## Overview

This package exists of two parts;

1. A python package; `helmet`, which you can install in your Jupyter Notebook/Sagemaker/Colab
2. A webapp: `helmet-platform`, which deploys an API to save al the runs & projects and interacts with the frontend. A frontend should also be deployed.

### Configuration files

#### Platform configuration

```python
project_name = "Project Name"
project_id = "Id" # (get from frontend or code)
platform_url = "https://" # Please do not change this

```

#### Model configuration

```python
# This should be the name as is presented on Huggingface 🤗
checkpoint = "meta-llama/Meta-Llama-3-8B-Instruct"
# The embeddings are needed for the XAI part. This varies between models, thus please provide it yourself.
embeddings = "model.embed_tokens"

# This is for wrapper to know what kind of model it is.
model_type = "dec"
```

#### Model Args

```python
# This is needed to use Llama-3
access_token = "hf_"

# You can add more here if you like
model_args = {
    "token": access_token
}
```

#### Run configuration

```python
run_config = {
    # "cuda" & "cpu" are currently supported
    "device": device,
}
```

### Load/create project

Creating a project can be done by current the following python code in your jupyter notebook.

```python
project_id = get_or_create_project(platform_url, project_name, "text_generation")
```

This will give you back the ID of the project, that you can then use to load the model.

After you have configured the model, platform & device, you can start loading the model like this:

```python
model = from_pretrained(checkpoint, model_type, embeddings, project_id, device, platform_url, model_args)
```

### Features

- Load any causal model from Huggingface.
- Create a project for your experiment
- Run experimental prompts

### Demo

A demo can be found at [https://helmet.jeroennelen.nl](https://helmet.jeroennelen.nl)

### Component architecture

<p align="center">
<img  width="75%" src="docs/helmet simplified.png" />
</p>

## Install from source

To use helmet in one of the examples perform the following steps:

1. Create venv with `python -m venv .venv`
2. Activate the venv with `source .venv/bin/activate`
3. Install HELMET from source (from git, when located in the home folder of helmet `pip install -e .`
4. Install jupyter notebook `pip install jupyterlab`

To remove:

1. `deactivate`
2. `jupyter-kernelspec uninstall venv`
3. `rm -r venv`

## Running webapp locally

For this, please check the `README` in the webapp

## Credits

Some inspiration has been drawn from a couple of other tools:

- [Interpret-ml](https://github.com/kayoyin/interpret-lm)
- [Ecco](https://github.com/jalammar/ecco)
- [Phoenix](https://github.com/Arize-ai/phoenix)
- [Inseq](https://github.com/inseq-team/inseq)
- [Ferret](https://github.com/g8a9/ferret)

## License

`helmet` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
