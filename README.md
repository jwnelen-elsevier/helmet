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
project_setup = {
    # This should point to the NodeJS API
    platform_url: "localhost:4000"
    project_id: "<ID>"
}
```

#### Model configuration

```python
model_checkpoint = "meta-llama/Meta-Llama-3-8B"
model_setup = {
    "checkpoint": model_checkpoint,
    # This can be enc/enc-dec/dec
    "model_type": "dec",
    # This should specify where the embeddings are stored
    "embeddings": "model.embed_tokens",
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
project_id = helmet.get_or_create_project("<platform url>", "<project name>", "text_generation")
```

This will give you back the ID of the project, that you can then use to load the model.

After you have configured the model, platform & device, you can start loading the model like this:

```python
model = helmet.from_pretrained(project_setup, model_setup, run_config)
```

### Features

- Load any causal model from Huggingface.
- Create a project for your experiment
- Run experimental prompts

### Demo

A demo can be found at [https://helmet.jeroennelen.nl](https://helmet.jeroennelen.nl)

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
