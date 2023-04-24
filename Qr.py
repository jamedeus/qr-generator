import io

from PIL import Image, ImageDraw, ImageFont



# Base class for all QR generators
class Qr():
    def __init__(self):
        # Generate QR code + PNG in memory buffer
        self.qr_raw = self.generate_qr_code()
        self.qr_image = self.generate_qr_image()

    # Child classes must contain this method with appropriate data string
    #def generate_qr_code(self):
        #return pyqrcode.create(f'')

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

    # Takes list of dicts with text and font keys
    # Returns completed QR image with all rows inserted underneath
    def add_text(self):

        # Amount of space needed under QR code for given text + font size
        add_height = 0

        # Used to calculate dimensions of rendered text
        draw = ImageDraw.Draw(self.qr_image)

        # Iterate rows, calculate height, add to add_height
        for row in self.caption:
            row_width, row_height = draw.textsize(row['text'], row['font'])
            add_height += row_height

        # Create empty space for text
        text_area = Image.new('RGB', (self.qr_image.width, add_height), color='white')

        # Add text_area below QR code with enough space for all rows
        result = Image.new('RGB', (self.qr_image.width, self.qr_image.height + text_area.height))
        result.paste(self.qr_image, (0, 0))
        result.paste(text_area, (0, self.qr_image.height))
        draw = ImageDraw.Draw(result)

        # Track space used by each row so next doesn't overlap
        used_height = 0

        # Iterate rows again, calculate position, add text
        for row in self.caption:
            row_width, row_height = draw.textsize(row['text'], row['font'])

            # Calc info position, add text
            x = (self.qr_image.width - row_width) // 2
            y = self.qr_image.height + used_height - 24

            # Prevent next overlapping
            used_height += row_height

            # Add row to image
            draw.text((x, y), row['text'], font=row['font'], align='center', fill=(0, 0, 0))

        return result

    # Save PNG to disk, filename from attribute unless set
    def save(self, filename=None):
        if filename is None:
            # Write to disk with default filename format
            self.qr_complete.save(f"{self.filename}.png")

        else:
            # Remove extension if present
            if filename.endswith(".png"):
                filename = filename[0:-4]

            # Write to disk with chosen name
            self.qr_complete.save(f"{filename}.png")
