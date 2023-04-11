# syntax=docker/dockerfile:1

# Node dependencies build stage
FROM node:19-buster-slim as node_build

COPY package.json .
RUN npm install

# Final build stage
FROM ubuntu:jammy
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/usr/local/bin:${PATH}"

# Install python
RUN apt-get update && \
    apt-get install -y python3.10 python3-pip fonts-ubuntu && \
    rm -rf /var/lib/apt/lists/*

# Copy node + python dependencies to final build stage
COPY --from=node_build node_modules/bootstrap/dist/css/bootstrap.min.css /mnt/node_modules/bootstrap/dist/css/bootstrap.min.css
COPY --from=node_build node_modules/bootstrap/dist/js/bootstrap.min.js /mnt/node_modules/bootstrap/dist/js/bootstrap.min.js
COPY --from=node_build node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js /mnt/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js

WORKDIR /mnt/

# Install python dependencies
COPY requirements.txt /mnt/requirements.txt
RUN pip install --no-cache-dir -r /mnt/requirements.txt

# Copy app, run
COPY app.py /mnt/app.py
COPY ContactQr.py /mnt/ContactQr.py
COPY templates/ /mnt/templates
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
