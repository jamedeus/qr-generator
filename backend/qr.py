'''Base class for generating QR code images with text captions.'''

import io

from PIL import Image, ImageDraw, ImageFont


class Qr():
    '''Base class for generating QR code images with text captions.

    This class must be subclassed and cannot be used on its own. It provides
    methods to convert a pyqrcode instance into a PNG with configurable width,
    to add dynamically-sized text underneath the QR code, and to write the PNG
    to disk.

    The child class must contain a _generate_qr_code method which returns a
    pyqrcode instance with the appropriate data.

    The child class must also contain a _caption attribute containing a list of
    dicts, one dict for each line of the caption. Each dict contains a text key
    with the caption text and a font key with a PIL.ImageFont. Fonts can be
    generated with the _get_font method on this class.
    '''

    # Font paths
    _MONO_FONT = "/usr/share/fonts/truetype/ubuntu/UbuntuMono-R.ttf"
    _MONO_FONT_BOLD = "/usr/share/fonts/truetype/ubuntu/UbuntuMono-B.ttf"
    _SANS_FONT = "/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf"
    _SANS_FONT_BOLD = "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf"

    def __init__(self):
        # Default filename (subclass should replace)
        self.filename = "QR"

        # Stores pyqrcode instance generated by _generate_qr_code method
        self.qr_raw = None

        # Stores PIL.Image containing QR code PNG
        self.qr_image = None

        # List returned by _generate_caption method (1 dict per caption line)
        self._caption = None

        # Finished PIL.Image PNG with QR code and caption
        self.qr_complete = None

    def generate(self):
        '''Calls all methods to generate complete QR code'''
        self.qr_raw = self._generate_qr_code()
        self.qr_image = self._generate_qr_image()
        self._caption = self._generate_caption()
        self.qr_complete = self._add_text()

    def _generate_qr_code(self):
        '''Subclass must replace with a method that returns pyqrcode instance'''
        raise NotImplementedError("Subclass must implement _generate_qr_code method")

    def _generate_caption(self):
        '''Subclass must replace with a method that returns list of dict (1 for
        each caption line). Dicts must have "text" (caption string) and "font"
        (returned by _get_font method) keys.
        '''
        raise NotImplementedError("Subclass must implement _generate_caption method")

    def _generate_qr_image(self, size=500):
        '''Returns PIL.Image with QR code png. Must call _generate_qr_code first.
        Size arg sets approximate width (pixels) of output PNG (will calculate
        closest size that does not require scaling).
        '''

        # Calc scale needed for requested size
        scale = int(size / self.qr_raw.symbol_size(border=3)[0])

        # Write QR to PNG in mem buffer
        image = io.BytesIO()
        self.qr_raw.save(image, scale=scale, border=3, kind='png')

        # Return PIL object instantiated from buffer
        return Image.open(image)

    def _get_font(self, text, font_path, max_size):
        '''Takes caption string, font path, and image width.
        Returns PIL.ImageFont with size that makes text 90% image width or less.
        '''

        # For calculating text dimensions
        draw = ImageDraw.Draw(self.qr_image)
        max_width = int(self.qr_image.width * 0.90)

        # Start at max size, decrease until text fits
        font = ImageFont.truetype(font_path, max_size)
        while draw.textbbox((0, 0), text, font)[2] > max_width:
            max_size -= 1
            font = ImageFont.truetype(font_path, max_size)

        return font

    def _add_text(self):
        '''Iterates self._caption list and adds each string to self.qr_image.
        Returns completed image with all caption lines underneath QR code.
        '''

        # Amount of space needed under QR code for given text + font size
        add_height = 0

        # Used to calculate dimensions of rendered text
        draw = ImageDraw.Draw(self.qr_image)

        # Iterate rows, calculate height, add to add_height
        for row in self._caption:
            _, _, row_width, row_height = draw.textbbox(
                xy=(0, 0),
                text=row['text'],
                font=row['font']
            )
            add_height += row_height

        # Create empty space for text
        text_area = Image.new(
            'RGB',
            (self.qr_image.width, add_height),
            color='white'
        )

        # Add text_area below QR code with enough space for all rows
        result = Image.new(
            'RGB',
            (
                self.qr_image.width,
                self.qr_image.height + text_area.height
            )
        )
        result.paste(self.qr_image, (0, 0))
        result.paste(text_area, (0, self.qr_image.height))
        draw = ImageDraw.Draw(result)

        # Track space used by each row so next doesn't overlap
        used_height = 0

        # Iterate rows again, calculate position, add text
        for row in self._caption:
            _, _, row_width, row_height = draw.textbbox(
                xy=(0, 0),
                text=row['text'],
                font=row['font']
            )

            # Calc info position, add text
            x = (self.qr_image.width - row_width) // 2
            y = self.qr_image.height + used_height - 24

            # Prevent next line overlapping
            used_height += row_height

            # Add row to image
            draw.text(
                (x, y),
                row['text'],
                font=row['font'],
                align='center',
                fill=(0, 0, 0)
            )

        return result

    def save(self, filename=None):
        '''Save PNG to disk, uses self.filename unless arg passed'''

        if filename is None:
            # Write to disk with default filename format
            self.qr_complete.save(f"{self.filename}.png")

        else:
            # Remove extension if present
            if filename.endswith(".png"):
                filename = filename[0:-4]

            # Write to disk with chosen name
            self.qr_complete.save(f"{filename}.png")
