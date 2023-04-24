# syntax=docker/dockerfile:1

# Node dependencies build stage
FROM node:19-buster-slim as node_build

COPY package.json .
RUN npm install

# Install Ubuntu fonts stage
FROM ubuntu:jammy as font_stage
RUN apt-get update && apt-get install -y fonts-ubuntu

# Final build stage
FROM python:3.10-slim-buster
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/usr/local/bin:${PATH}"

# Copy node + python dependencies to final build stage
COPY --from=node_build node_modules/bootstrap/dist/css/bootstrap.min.css /mnt/node_modules/bootstrap/dist/css/bootstrap.min.css
COPY --from=node_build node_modules/bootstrap/dist/js/bootstrap.bundle.min.js /mnt/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js
COPY --from=node_build node_modules/bootstrap-icons/font/bootstrap-icons.css /mnt/node_modules/bootstrap-icons/font/bootstrap-icons.css
COPY --from=node_build node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff /mnt/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff
COPY --from=node_build node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2 /mnt/node_modules/bootstrap-icons/font/fonts/bootstrap-icons.woff2
COPY --from=node_build node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js /mnt/node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js

# Copy Ubuntu fonts to final build stage
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf /usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf /usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf /usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf

WORKDIR /mnt/

# Install python dependencies
COPY requirements.txt /mnt/requirements.txt
RUN pip install --no-cache-dir -r /mnt/requirements.txt

# Copy app, run
COPY app.py /mnt/app.py
COPY Qr.py /mnt/Qr.py
COPY ContactQr.py /mnt/ContactQr.py
COPY WifiQr.py /mnt/WifiQr.py
COPY LinkQr.py /mnt/LinkQr.py
COPY templates/ /mnt/templates
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
