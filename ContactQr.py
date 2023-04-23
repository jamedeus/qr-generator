#!/usr/bin/env python3

from PIL import Image, ImageDraw, ImageFont
import pyqrcode
import io



class ContactQr():
    def __init__(self, first_name, last_name, phone, email):
        self.first_name = first_name.strip().capitalize()
        self.last_name = last_name.strip().capitalize()
        self.phone = phone.strip()
        self.email = email.strip().lower()

        # Generate QR code - binary, png, labeled png
        self.qr_raw = self.generate_qr_code()
        self.qr_image = self.generate_qr_image()
        self.qr_complete = self.add_text()

    # Returns pyqrcode instance
    def generate_qr_code(self):
        # Remove non-numeric characters
        phone = ''.join(c for c in self.phone if c.isdigit())

        return pyqrcode.create(f"MECARD:N:{self.last_name},{self.first_name};TEL:{phone};EMAIL:{self.email};")

    # Returns PIL.Image containing QR code png
    def generate_qr_image(self, size=500):
        # Calc scale needed for requested size
        scale = int(size / self.qr_raw.get_png_size())

        # Write QR to PNG in mem buffer
        image = io.BytesIO()
        self.qr_raw.png(image, scale=scale)

        # Return PIL object instantiated from buffer
        return Image.open(image)

    # Find font size so text is 90% image width or less
    def get_font(self, text, font_path, max_size):
        # For calculating text dimensions
        draw = ImageDraw.Draw(self.qr_image)
        max_width = int(self.qr_image.width * 0.90)

        # Start at max size, decrease until text fits
        font = ImageFont.truetype(font_path, max_size)
        while draw.textsize(text, font)[0] > max_width:
            max_size -= 1
            font = ImageFont.truetype(font_path, max_size)

        return font

    # Returns completed QR image with dynamically-sized text
    def add_text(self):
        # Create name string, get font size
        name = f"{self.first_name} {self.last_name}"
        name_font = self.get_font(name, "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf", 42)

        # Create contact info string, get font size (at least 6 points smaller than name)
        info = f"{self.email}\n{self.phone}"
        info_font = self.get_font(info, "/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf", name_font.size-6)

        # Calculate dimensions of rendered text
        draw = ImageDraw.Draw(self.qr_image)
        name_width, name_height = draw.textsize(name, name_font)
        info_width, info_height = draw.textsize(info, info_font)

        # Create empty space for text
        text_area = Image.new('RGB', (self.qr_image.width, name_height + info_height), color='white')

        # Add text_area below QR code
        result = Image.new('RGB', (self.qr_image.width, self.qr_image.height + text_area.height))
        result.paste(self.qr_image, (0, 0))
        result.paste(text_area, (0, self.qr_image.height))
        draw = ImageDraw.Draw(result)

        # Calc name position, add text
        x = (self.qr_image.width - name_width) // 2
        y = self.qr_image.height - 24
        draw.text((x, y), name, font=name_font, align='center', fill=(0, 0, 0))

        # Calc info position, add text
        x = (self.qr_image.width - info_width) // 2
        y = self.qr_image.height + name_height - 24
        draw.text((x, y), info, font=info_font, align='center', fill=(0, 0, 0))

        return result

    # Save PNG to disk, filename from attributes unless set
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
