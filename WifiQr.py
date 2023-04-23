#!/usr/bin/env python3

from PIL import Image, ImageDraw, ImageFont
import pyqrcode
import io



class WifiQr():
    def __init__(self, ssid, password):
        self.ssid = ssid.strip()
        self.password = password.strip()

        # Generate QR code - binary, png, labeled png
        self.qr_raw = self.generate_qr_code()
        self.qr_image = self.generate_qr_image()
        self.qr_complete = self.add_text()

    # Returns pyqrcode instance
    def generate_qr_code(self):
        return pyqrcode.create(f"WIFI:T:WPA;S:{self.ssid};P:{self.password};;")

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

        # Get font size for longest param, format so shorter is centered above/below
        # Ex:
        # SSID:      short
        # PASS: loooooooooooong
        if len(self.ssid) > len(self.password):
            padding = len(self.ssid) - len(self.password)
            padding_front = int(padding/2)
            padding -= padding_front

            ssid = f"SSID: {self.ssid}"
            password = f"PASS: {' '*padding_front}{self.password}{' '*padding}"

            font = self.get_font(ssid, "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf", 64)
        else:
            padding = len(self.password) - len(self.ssid)
            padding_front = int(padding/2)
            padding -= padding_front

            ssid = f"SSID: {' '*padding_front}{self.ssid}{' '*padding}"
            password = f"PASS: {self.password}"

            font = self.get_font(password, "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf", 64)

        # Calculate dimensions of rendered text
        draw = ImageDraw.Draw(self.qr_image)
        ssid_width, ssid_height = draw.textsize(ssid, font)
        password_width, password_height = draw.textsize(password, font)

        # Create empty space for text
        text_area = Image.new('RGB', (self.qr_image.width, ssid_height + password_height), color='white')

        # Add text_area below QR code
        result = Image.new('RGB', (self.qr_image.width, self.qr_image.height + text_area.height))
        result.paste(self.qr_image, (0, 0))
        result.paste(text_area, (0, self.qr_image.height))
        draw = ImageDraw.Draw(result)

        # Calc ssid position, add text
        x = (self.qr_image.width - ssid_width) // 2
        y = self.qr_image.height - 24
        draw.text((x, y), ssid, font=font, align='center', fill=(0, 0, 0))

        # Calc password position, add text
        x = (self.qr_image.width - password_width) // 2
        y = self.qr_image.height + ssid_height - 24
        draw.text((x, y), password, font=font, align='center', fill=(0, 0, 0))

        return result

    # Save PNG to disk, filename from attributes unless set
    def save(self, filename=None):
        if filename is None:
            # Write to disk with default filename format
            self.qr_complete.save(f"{self.ssid}_Wifi_QR.png")

        else:
            # Remove extension if present
            if filename.endswith(".png"):
                filename = filename[0:-4]

            # Write to disk with chosen name
            self.qr_complete.save(f"{filename}.png")
