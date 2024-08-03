'''Subclass of Qr for generating link QR codes.'''

import pyqrcode

from qr import Qr


class LinkQr(Qr):
    '''Subclass of Qr for generating link QR codes.

    Generates a link QR code image containing any URL. A text caption with the
    URL and optional text description is added below the QR code for easy
    identification.

    The image with caption can be accessed at the qr_complete attribute.
    The image with no caption can be accessed at the qr_image attribute.
    '''

    def __init__(self, url, text=None):
        super().__init__()

        self.url = url.strip()
        self.text = text

        # Remove protocol, set attribute for inherited save method
        if self.url.startswith('https://'):
            self.filename = f"{self.url[8:]}_QR"
        elif self.url.startswith('http://'):
            self.filename = f"{self.url[7:]}_QR"
        else:
            self.filename = f"{self.url}_QR"

        # Create QR code
        self.generate()

    def _generate_qr_code(self):
        '''Returns pyqrcode instance with URL from class attribute.'''
        return pyqrcode.create(f'{self.url}')

    def _generate_caption(self):
        '''Returns list of caption dicts used by Qr.add_text method.'''

        # Get font, remove protocol and "_QR" from caption for readability
        font = self._get_font(self.filename[:-3], self._MONO_FONT, 42)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        caption = [
            {'text': self.filename[:-3], 'font': font}
        ]

        # If text given add above URL in bold + larger font
        if self.text:
            font = self._get_font(self.text, self._MONO_FONT_BOLD, 72)
            caption.insert(0, {'text': self.text, 'font': font})

        return caption
