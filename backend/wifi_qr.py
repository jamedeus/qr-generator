'''Subclass of Qr for generating wifi network QR codes.'''

import pyqrcode

from qr import Qr


class WifiQr(Qr):
    """Subclass of Qr for generating wifi network QR codes.

    Generates a wifi QR code image containing SSID and password. A text caption
    with the same details is added below the QR code for easy identification.

    The image with caption can be accessed at the qr_complete attribute.
    The image with no caption can be accessed at the qr_image attribute.
    """

    def __init__(self, ssid, password):
        super().__init__()

        self.ssid = ssid.strip()
        self.password = password.strip()

        # Set attribute for inherited save method
        self.filename = f"{self.ssid}_Wifi_QR"

        # Create QR code
        self.generate()

    def generate_qr_code(self):
        '''Returns pyqrcode instance with wifi credentials from class attributes.'''
        return pyqrcode.create(f"WIFI:T:WPA;S:{self.ssid};P:{self.password};;")

    def generate_caption(self):
        '''Returns list of caption dicts used by Qr.add_text method.'''

        # Get font size for longest param, format so shorter is centered above/below
        # Ex:
        # SSID:      short
        # PASS: loooooooooooong
        if len(self.ssid) > len(self.password):
            padding = len(self.ssid) - len(self.password)
            padding_front = int(padding / 2)
            padding -= padding_front

            ssid = f"SSID: {self.ssid}"
            password = f"PASS: {' '*padding_front}{self.password}{' '*padding}"

        else:
            padding = len(self.password) - len(self.ssid)
            padding_front = int(padding / 2)
            padding -= padding_front

            ssid = f"SSID: {' '*padding_front}{self.ssid}{' '*padding}"
            password = f"PASS: {self.password}"

        font = self.get_font(ssid, self.MONO_FONT, 64)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        return [
            {'text': ssid, 'font': font},
            {'text': password, 'font': font}
        ]
