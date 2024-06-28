#!/usr/bin/env python3

'''Flask backend for QR Generator webapp.'''

import io
import json
import base64

from flask import Flask, request, render_template, jsonify

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


def img_to_base64_string(img):
    '''Takes PIL.Image, saves to memory buffer, returns as base64 string'''
    img_buffer = io.BytesIO()
    img.save(img_buffer, format="PNG")
    return base64.b64encode(img_buffer.getvalue()).decode("utf-8")


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

    # Return JSON containing QR code with and without caption as base64 strings
    return jsonify({
        'caption': img_to_base64_string(qr.qr_complete),
        'no_caption': img_to_base64_string(qr.qr_image)
    })


if __name__ == '__main__':  # pragma: no cover
    app.run(host='0.0.0.0', debug=True)
