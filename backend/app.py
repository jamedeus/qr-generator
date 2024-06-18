#!/usr/bin/env python3

'''Flask backend for QR Generator webapp.'''

import io
import json
import base64

from flask import Flask, request, render_template

from contact_qr import ContactQr
from wifi_qr import WifiQr
from link_qr import LinkQr


app = Flask(
    __name__,
    static_folder='../dist',
    template_folder='../templates'
)


@app.get("/")
def serve():
    '''Serves frontend.'''
    return render_template('index.html')


@app.post("/generate")
def generate():
    '''Expects POST containing form data from frontend.
    Instantiates correct QR class, generates image, returns as base64 string.
    '''

    data = request.get_json()
    print(f'\nGenerate:\n{json.dumps(data, indent=4)}\n')

    # Instantiate class for selected QR type
    if data['type'] == 'contact-qr':
        qr = ContactQr(
            data['firstName'],
            data['lastName'],
            data['phone'],
            data['email']
        )

    elif data['type'] == 'wifi-qr':
        qr = WifiQr(
            data['ssid'],
            data['password']
        )

    elif data['type'] == 'link-qr':
        qr = LinkQr(
            data['url'],
            data['text']
        )

    else:
        return 'Unsupported QR code type', 400

    # Save PNG to memory buffer, convert to base64 string
    buffered = io.BytesIO()
    qr.qr_complete.save(buffered, format="PNG")
    img_bytes = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # Return base64 string
    return img_bytes


if __name__ == '__main__':  # pragma: no cover
    app.run(host='0.0.0.0', debug=True)
