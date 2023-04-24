[![pipeline status](https://gitlab.com/jamedeus/qr-generator/badges/master/pipeline.svg)](https://gitlab.com/jamedeus/qr-generator/-/commits/master)
[![coverage report](https://gitlab.com/jamedeus/qr-generator/badges/master/coverage.svg)](https://gitlab.com/jamedeus/qr-generator/-/commits/master)

# QR Code Generator

A lightweight, responsive webapp that generates QR codes for Contact Info, Wifi Credentials, and URLs.

Dynamically-sized text is baked into the output image for easy identification.

Includes a minimalist (137MB) docker image and example docker-compose.yaml with pre-written reverse proxy config.

## Screenshots

<p align="center">
  <img src="/img/example1.png" width="30%" alt="Example 1">
  <img src="/img/example2.png" width="30%" alt="Example 2">
  <img src="/img/example3.png" width="30%" alt="Example 3">
</p>


## Setup

### Docker Compose (recommended)

1. Add the following to your `docker-compose.yaml`:
```
  qr-generator:
    image: jamedeus/qr-generator:latest
    container_name: qr-generator
    ports:
      - 8000:5000
    restart: unless-stopped
```

2. Start the app with `docker compose up -d`, the latest version will be pulled automatically.

The app can now be accessed at `http://localhost:8000`.

See the included [docker compose example](/docker-compose.yaml) for reverse proxy configuration. Note that for this to work your router must be configured to redirect `qr.lan/` (or chosen domain) to the IP of your host.

### Docker CLI (not recommended)

The image can also be run from the command line - this is useful for testing, but docker-compose is strongly recommended for deployment.

1. Pull image from Docker Hub:
```
docker pull jamedeus/qr-generator:latest
```

2. Run container:
```
docker run -d -p 8000:5000 --name qr-generator jamedeus/qr-generator:latest
```
The app can now be accessed at `http://localhost:8000`.

### Local Development Server (not recommended)

1. Clone the repository:
```
git clone https://gitlab.com/jamedeus/qr-generator.git
cd qr-generator
```

2. Install dependencies:
```
pip install -r requirements.txt
npm install
```

3. Run:
```
./app.py
```

The app can now be accessed at `http://localhost:5000`.

To build the docker image run:
```
cd qr-generator
docker build -t qr-generator:1.0 . -f Dockerfile
```
