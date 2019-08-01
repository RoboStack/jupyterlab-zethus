# jupyterlab-zethus

A JupyterLab extension for standalone integration of *ZETHUS* into JupyterLab.

## Prerequisites

* JupyterLab

## Installation

*NOT PUBLISHED YET -- THIS DOES NOT WORK!*

```bash
jupyter labextension install jupyterlab-zethus
```

## Usage

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

## License

The files herein, and especially the source code of zethus, is licensed under the Apache 2.0 License.
The copyright holders of zethus is Rapyuta Robotics (http://www.rapyuta-robotics.com). The original source code
vendored in this package is taken from: https://github.com/rapyuta-robotics/zethus