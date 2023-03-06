#!/usr/bin/env python3

from PIL import Image, ImageDraw, ImageFont
import pyqrcode
import io
import phonenumbers



class ContactQr():
    def __init__(self, first_name, last_name, phone, email):
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.email = email

        self.qr_raw = self.generate_qr_code()

        self.qr_complete = self.add_text()

    def generate_qr_code(self):
        return pyqrcode.create(f"MECARD:N:{self.last_name},{self.first_name};TEL:{self.phone};EMAIL:{self.email};")

    def add_text(self):
        # Calc scale needed for approx 500x500 output
        scale = int(500 / self.qr_raw.get_png_size())

        # Write QR to PNG in mem buffer
        image = io.BytesIO()
        self.qr_raw.png(image, scale=scale)

        # Instantiate PIL object from buffer
        qr_code = Image.open(image)

        # For calculating text dimensions
        draw = ImageDraw.Draw(qr_code)

        # Name, large font, bold
        name = f"{self.first_name} {self.last_name}"
        name_font = ImageFont.truetype("/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf", 38)
        name_width, name_height = draw.textsize(name, name_font)

        # Format phone number
        phone = phonenumbers.parse(self.phone, "US")
        phone = phonenumbers.format_number(phone, phonenumbers.PhoneNumberFormat.NATIONAL)

        # Contact info, smaller font on 2 lines below name
        info = f"{self.email}\n{self.phone}"
        info_font = ImageFont.truetype("/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf", 32)
        info_width, info_height = draw.textsize(info, info_font)

        # Create empty space for text
        text_area = Image.new('RGB', (qr_code.width, name_height + info_height + scale), color='white')

        # Add text_area below QR code
        result = Image.new('RGB', (qr_code.width, qr_code.height + text_area.height))
        result.paste(qr_code, (0, 0))
        result.paste(text_area, (0, qr_code.height))

        # Add text
        draw = ImageDraw.Draw(result)

        # Calc name position, add
        x = (qr_code.width - name_width) // 2
        y = qr_code.height - scale*2
        draw.text((x, y), name, font=name_font, align='center', fill=(0, 0, 0))

        # Calc info position, add
        x = (qr_code.width - info_width) // 2
        y = qr_code.height + name_height - scale*2
        draw.text((x, y), info, font=info_font, align='center', fill=(0, 0, 0))

        return result

    def save(self, filename=None):
        if filename is None:
            # Write to disk with default filename format
            self.qr_complete.save(f"{self.first_name}-{self.last_name}_contact.png")

        else:
            # Remove extension if present
            if filename.endswith(".png"):
                filename = filename[0:-4]

            # Write to disk with chosen name
            self.qr_complete.save(f"{filename}.png")
