import pyqrcode

from Qr import Qr



class ContactQr(Qr):
    def __init__(self, first_name, last_name, phone, email):
        self.first_name = first_name.strip().capitalize()
        self.last_name = last_name.strip().capitalize()
        self.phone = phone.strip()
        self.email = email.strip().lower()

        # Set attribute for inherited save method
        self.filename = f"{self.first_name}-{self.last_name}_contact"

        # Create QR code
        super().__init__()

        # Create name string, get font size
        name = f"{self.first_name} {self.last_name}"
        name_font = self.get_font(name, self.sans_font_bold, 42)

        # Create contact info string, get font size (at least 6 points smaller than name)
        info = f"{self.email}\n{self.phone}"
        info_font = self.get_font(info, self.sans_font, name_font.size-6)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        self.caption = [
            {'text': name, 'font': name_font},
            {'text': info, 'font': info_font}
        ]

        # Add caption to QR Image
        self.qr_complete = self.add_text()

    # Returns pyqrcode instance
    def generate_qr_code(self):
        # Remove non-numeric characters
        phone = ''.join(c for c in self.phone if c.isdigit())

        return pyqrcode.create(f"MECARD:N:{self.last_name},{self.first_name};TEL:{phone};EMAIL:{self.email};")
