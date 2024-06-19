[![pipeline status](https://gitlab.com/jamedeus/qr-generator/badges/master/pipeline.svg)](https://gitlab.com/jamedeus/qr-generator/-/commits/master)
[![coverage report](https://gitlab.com/jamedeus/qr-generator/badges/master/coverage.svg?job=test_backend&key_text=Backend+Coverage&key_width=120)](https://gitlab.com/jamedeus/qr-generator/-/commits/master)
[![coverage report](https://gitlab.com/jamedeus/qr-generator/badges/master/coverage.svg?job=test_frontend&key_text=Frontend+Coverage&key_width=120)](https://gitlab.com/jamedeus/qr-generator/-/commits/master)
[![pylint score](https://gitlab.com/jamedeus/qr-generator/-/jobs/artifacts/master/raw/pylint/pylint.svg?job=pylint)](https://gitlab.com/jamedeus/qr-generator/-/jobs/artifacts/master/raw/pylint/pylint.log?job=pylint)

# QR Code Generator

A lightweight (141MB) webapp that generates QR codes for Contact Info, Wifi Credentials, and URLs.

Dynamically-sized text is baked into the output image for easy identification.

Multi-arch image available on [Docker Hub](https://hub.docker.com/r/jamedeus/qr-generator), supports x86_64 and arm64.

## Screenshots

<p align="center">
  <img src="https://gitlab.com/jamedeus/qr-generator/-/raw/master/img/form-light.png" width="30%" alt="Form Example">
  <img src="https://gitlab.com/jamedeus/qr-generator/-/raw/master/img/contact-qr-light.png" width="30%" alt="Contact Info Example">
  <img src="https://gitlab.com/jamedeus/qr-generator/-/raw/master/img/wifi-qr-light.png" width="30%" alt="Wifi Example">
</p>
<details close>
  <summary>Dark theme</summary>
  <p align="center">
    <img src="https://gitlab.com/jamedeus/qr-generator/-/raw/master/img/form-dark.png" width="30%" alt="Form Example">
    <img src="https://gitlab.com/jamedeus/qr-generator/-/raw/master/img/contact-qr-dark.png" width="30%" alt="Contact Info Example">
    <img src="https://gitlab.com/jamedeus/qr-generator/-/raw/master/img/wifi-qr-dark.png" width="30%" alt="Wifi Example">
  </p>
</details>

## Setup

### Docker Compose (recommended)

The included `docker-compose.yaml` can be used as-is, simply clone the repo and start it:
```
git clone https://gitlab.com/jamedeus/qr-generator.git
cd qr-generator
docker compose up -d
```
The app can now be accessed at [http://localhost:8000](http://localhost:8000).

To use the included reverse proxy, configure your local DNS to redirect `qr-generator.lan/` to the IP of your docker host.

If you have an existing `docker-compose.yaml`, see the [example config](/docker-compose.yaml).

### Docker CLI (not recommended)

Running from the command line can be useful for testing, but docker-compose is strongly recommended for deployment.

1. Pull image from Docker Hub:
```
docker pull jamedeus/qr-generator:latest
```

2. Run container:
```
docker run -d -p 8000:5000 --name qr-generator jamedeus/qr-generator:latest
```
The app can now be accessed at [http://localhost:8000](http://localhost:8000).

### Local Development Server (not recommended)

1. Clone the repository:
```
git clone https://gitlab.com/jamedeus/qr-generator.git
cd qr-generator
```

2. Install dependencies and build the frontend:
```
pip3 install pipenv
pipenv install
npm install
npm run build
```

3. Run:
```
pipenv run backend/app.py
```

The app can now be accessed at [http://localhost:5000](http://localhost:5000).

To automatically rebuild the frontend when changes are made run `npm run build:dev`.

To build the docker image run:
```
cd qr-generator
docker build -t qr-generator:1.0 . -f Dockerfile
```

## Version history

[Changelog](changelog.md)
