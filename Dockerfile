# syntax=docker/dockerfile:1

# Node dependencies build stage
FROM node:19-buster-slim AS node_build

# Copy source files
COPY src/ ./src/
COPY .babelrc .
COPY package.json .
COPY webpack.config.js .

# Install dependencies, build frontend
RUN npm install
RUN npm run build

# Install Ubuntu fonts stage
FROM ubuntu:jammy AS font_stage
RUN apt-get update && apt-get install -y fonts-ubuntu

# Final build stage
FROM python:3.10-slim-buster
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/usr/local/bin:${PATH}"

# Copy node dependencies to final build stage
COPY --from=node_build dist/ /mnt/dist/

# Copy Ubuntu fonts to final build stage
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf /usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf /usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf /usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf
COPY --from=font_stage /usr/share/fonts/truetype/ubuntu/UbuntuMono-B.ttf /usr/share/fonts/truetype/ubuntu/UbuntuMono-B.ttf

# Install python dependencies
COPY requirements.txt /mnt/requirements.txt
RUN pip install --no-cache-dir -r /mnt/requirements.txt

# Copy app, run
COPY backend/ /mnt/backend
COPY templates/ /mnt/templates

WORKDIR /mnt/backend
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
