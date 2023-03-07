#!/usr/bin/env python3

from flask import Flask, request, render_template
from ContactQr import *
import json
import io
import base64

app = Flask(__name__, static_url_path='', static_folder='node_modules')

@app.get("/")
def serve():
    return render_template('index.html')

@app.post("/generate")
def generate():
    data = request.get_json()
    #print(json.dumps(data, indent=4))

    qr = ContactQr(data['firstName'], data['lastName'], data['phone'], data['email'])
    qr.save()

    buffered = io.BytesIO()
    qr.qr_complete.save(buffered, format="PNG")
    img_bytes = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return img_bytes



if __name__ == '__main__':
    app.run(host= '0.0.0.0', debug=True)
