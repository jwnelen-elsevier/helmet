<p align="center">
<img  width="75%" src="docs/helmet.png" />
</p>

## Contents

- [Installation helmet](#installation)
- [Local installation helmet-platform](#installation)
- [License](#license)

## Installation

```console
pip install helmet
```

### Use `helmet` in examples

To use helmet in one of the examples perform the following steps:

1. Create venv with `python -m venv .venv`
2. Activate the venv with `source .venv/bin/activate`
3. Install HELMET from source (from git, when located in the home folder of helmet `pip install -e .`
4. Install jupyter notebook `pip install jupyterlab`
5. Create a jupyter kernel based on the venv `python -m ipykernel install --user --name venv`
6. Open Jupyter notebook `jupyter lab`

To remove:

1. `deactivate`
2. `jupyter-kernelspec uninstall venv`
3. `rm -r venv`

## Configuration files

- Project configuration
- Model configuration
- Run configuration

## Features

- Load any causal model from Huggingface.
- Create a project for your experiment
- Run experimental prompts
-

## Running webapp locally

For this, please check the `README`

## License

`helmet` is distributed under the terms of the [MIT](https://spdx.org/licenses/MIT.html) license.
