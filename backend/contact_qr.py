'''Subclass of Qr for generating contact info QR codes.'''

import pyqrcode

from qr import Qr


class ContactQr(Qr):
    '''Subclass of Qr for generating contact info QR codes.

    Generates a contact info QR code image containing first name, last name,
    phone number, and email address. A text caption with the same details is
    added below the QR code for easy identification.

    The image with caption can be accessed at the qr_complete attribute.
    The image with no caption can be accessed at the qr_image attribute.
    '''

    def __init__(self, first_name, last_name, phone, email):
        super().__init__()

        self.first_name = first_name.strip().capitalize()
        self.last_name = last_name.strip().capitalize()
        self.phone = phone.strip()
        self.email = email.strip().lower()

        # Set attribute for inherited save method
        self.filename = f"{self.first_name}-{self.last_name}_contact"

        # Create QR code
        self.generate()

    def _generate_qr_code(self):
        '''Returns pyqrcode instance with contact info from class attributes.'''

        # Remove non-numeric characters
        phone = ''.join(c for c in self.phone if c.isdigit())

        return pyqrcode.create(
            f"MECARD:N:{self.last_name},{self.first_name};TEL:{phone};EMAIL:{self.email};"
        )

    def _generate_caption(self):
        '''Returns list of caption dicts used by Qr.add_text method.'''

        # Create name string, get font size
        name = f"{self.first_name} {self.last_name}"
        name_font = self._get_font(name, self._SANS_FONT_BOLD, 42)

        # Create contact info string, get font size (at least 6 points smaller than name)
        info = f"{self.email}\n{self.phone}"
        info_font = self._get_font(info, self._SANS_FONT, name_font.size - 6)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        return [
            {'text': name, 'font': name_font},
            {'text': info, 'font': info_font}
        ]
