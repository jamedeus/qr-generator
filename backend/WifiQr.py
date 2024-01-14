import pyqrcode

from Qr import Qr



class WifiQr(Qr):
    def __init__(self, ssid, password):
        self.ssid = ssid.strip()
        self.password = password.strip()

        # Set attribute for inherited save method
        self.filename = f"{self.ssid}_Wifi_QR"

        # Create QR code
        super().__init__()

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

        else:
            padding = len(self.password) - len(self.ssid)
            padding_front = int(padding/2)
            padding -= padding_front

            ssid = f"SSID: {' '*padding_front}{self.ssid}{' '*padding}"
            password = f"PASS: {self.password}"

        font = self.get_font(ssid, self.mono_font, 64)

        # List of dicts
        # Each dict contains text + font for 1 line under QR image
        self.caption = [
            {'text': ssid, 'font': font},
            {'text': password, 'font': font}
        ]

        # Add caption to QR Image
        self.qr_complete = self.add_text()

    # Returns pyqrcode instance
    def generate_qr_code(self):
        return pyqrcode.create(f"WIFI:T:WPA;S:{self.ssid};P:{self.password};;")
