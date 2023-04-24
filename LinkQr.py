import pyqrcode

from Qr import Qr



class LinkQr(Qr):
    def __init__(self, url):
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
        font = self.get_font(self.filename[:-3], "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf", 42)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        self.caption = [
            {'text': self.filename[:-3], 'font': font}
        ]

        # Add caption to QR Image
        self.qr_complete = self.add_text()

    # Returns pyqrcode instance
    def generate_qr_code(self):
        return pyqrcode.create(f'{self.url}')
