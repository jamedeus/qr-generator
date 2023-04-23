#!/usr/bin/env python3

from flask import Flask, request, render_template, send_file, jsonify
from ContactQr import *
from WifiQr import *
from LinkQr import *
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
    print(f'\nGenerate:\n{json.dumps(data, indent=4)}\n')

    if data['type'] == 'contact-qr':
        qr = ContactQr(data['firstName'], data['lastName'], data['phone'], data['email'])
        filename = f"{qr.first_name}-{qr.last_name}_contact.png"
    elif data['type'] == 'wifi-qr':
        qr = WifiQr(data['ssid'], data['password'])
        filename = f"{qr.ssid}_Wifi_QR.png"
    elif data['type'] == 'link-qr':
        qr = LinkQr(data['url'])
        filename = f"{qr.url[8:]}_QR.png"

    qr.save()

    buffered = io.BytesIO()
    qr.qr_complete.save(buffered, format="PNG")
    img_bytes = base64.b64encode(buffered.getvalue()).decode("utf-8")

    return jsonify({'filename': filename, 'qr': img_bytes})

@app.get("/download/<name>")
def download(name):
    return send_file(f'{name}_contact.png', as_attachment=True)


if __name__ == '__main__':
    app.run(host= '0.0.0.0', debug=True)
