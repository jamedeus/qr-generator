import pyqrcode

from Qr import Qr


class LinkQr(Qr):
    """Subclass of Qr for generating link QR codes.

    Generates a link QR code image containing any URL. A text caption with the
    URL and optional text description is added below the QR code for easy
    identification.

    The image with caption can be accessed at the qr_complete attribute.
    The image with no caption can be accessed at the qr_image attribute.
    """

    def __init__(self, url, text=None):
        self.url = url.strip()

        # Remove protocol, set attribute for inherited save method
        if self.url.startswith('https://'):
            self.filename = f"{self.url[8:]}_QR"
        elif self.url.startswith('http://'):
            self.filename = f"{self.url[7:]}_QR"
        else:
            self.filename = f"{self.url}_QR"

        # Create QR code
        super().__init__()

        # Get font, remove protocol and "_QR" from caption for readability
        font = self.get_font(self.filename[:-3], self.mono_font, 42)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        self.caption = [
            {'text': self.filename[:-3], 'font': font}
        ]

        # If text given add above URL in bold + larger font
        if text:
            font = self.get_font(text, self.mono_font_bold, 72)
            self.caption.insert(0, {'text': text, 'font': font})

        # Add caption to QR Image
        self.qr_complete = self.add_text()

    # Returns pyqrcode instance
    def generate_qr_code(self):
        return pyqrcode.create(f'{self.url}')
