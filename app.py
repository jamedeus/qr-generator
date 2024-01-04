#!/usr/bin/env python3

import io
import json
import base64

from flask import Flask, request, render_template

from ContactQr import ContactQr
from WifiQr import WifiQr
from LinkQr import LinkQr



app = Flask(__name__, static_url_path='', static_folder='node_modules')

@app.get("/")
def serve():
    return render_template('index.html')

@app.post("/generate")
def generate():
    data = request.get_json()
    print(f'\nGenerate:\n{json.dumps(data, indent=4)}\n')

    # Instantiate class for selected QR type
    if data['type'] == 'contact-qr':
        qr = ContactQr(data['firstName'], data['lastName'], data['phone'], data['email'])

    elif data['type'] == 'wifi-qr':
        qr = WifiQr(data['ssid'], data['password'])

    elif data['type'] == 'link-qr':
        qr = LinkQr(data['url'], data['text'])

    # Save PNG to memory buffer, convert to base64 string
    buffered = io.BytesIO()
    qr.qr_complete.save(buffered, format="PNG")
    img_bytes = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Return base64 string
    return img_bytes


if __name__ == '__main__':
    app.run(host= '0.0.0.0', debug=True)
