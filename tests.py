from unittest import TestCase
from unittest.mock import patch, MagicMock
from Qr import Qr
from ContactQr import ContactQr
from WifiQr import WifiQr
from LinkQr import LinkQr
from app import app
import json, os, io, base64
import PIL
import pyqrcode



class EndpointTests(TestCase):
    def setUp(self):
        self.app = app.test_client()

        # Dummy responses for mock methods
        self.dummy_font = PIL.ImageFont.truetype("/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf", 42)
        self.dummy_image = PIL.Image.new('RGB', (100, 100), color='white')

    def test_index(self):
        # Send request, confirm status
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_generate_contact_qr(self):
        # Payload sent by frontend
        payload = {'firstName': 'John', 'lastName': 'Doe','phone': '212-555-1234', 'email': 'john.doe@hotmail.com', 'type': 'contact-qr'}

        # Patch Qr methods to return dummy font and image
        with patch.object(Qr, 'get_font', return_value=self.dummy_font) as mock_get_font, \
             patch.object(Qr, 'add_text', return_value=self.dummy_image) as mock_add_text:

            # Send post request, confirm status, confirm methods called
            response = self.app.post('/generate', json=payload, content_type='application/json')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(mock_get_font.call_count, 2)
            self.assertEqual(mock_add_text.call_count, 1)

            # Confirm response contains base64-encoded PNG
            img = PIL.Image.open(io.BytesIO(base64.b64decode(response.data)))
            self.assertEqual(img.format, 'PNG')

    def test_generate_wifi_qr(self):
        # Payload sent by frontend
        payload = {'ssid': 'AzureDiamond', 'password': 'hunter2', 'type': 'wifi-qr'}

        # Patch Qr methods to return dummy font and image
        with patch.object(Qr, 'get_font', return_value=self.dummy_font) as mock_get_font, \
             patch.object(Qr, 'add_text', return_value=self.dummy_image) as mock_add_text:

            # Send post request, confirm status, confirm methods called
            response = self.app.post('/generate', json=payload, content_type='application/json')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(mock_get_font.call_count, 1)
            self.assertEqual(mock_add_text.call_count, 1)

            # Confirm response contains base64-encoded PNG
            img = PIL.Image.open(io.BytesIO(base64.b64decode(response.data)))
            self.assertEqual(img.format, 'PNG')

    def test_generate_link_qr(self):
        # Payload sent by frontend
        payload = {'url': 'https://jamedeus.com', 'type': 'link-qr'}

        # Patch Qr methods to return dummy font and image
        with patch.object(Qr, 'get_font', return_value=self.dummy_font) as mock_get_font, \
             patch.object(Qr, 'add_text', return_value=self.dummy_image) as mock_add_text:

            # Send post request, confirm status, confirm methods called
            response = self.app.post('/generate', json=payload, content_type='application/json')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(mock_get_font.call_count, 1)
            self.assertEqual(mock_add_text.call_count, 1)

            # Confirm response contains base64-encoded PNG
            img = PIL.Image.open(io.BytesIO(base64.b64decode(response.data)))
            self.assertEqual(img.format, 'PNG')


class ContactQrTests(TestCase):

    def test_contact_qr(self):
        # Instantiate, confirm attributes
        qr = ContactQr("John", "Doe", "(212) 555-1234", "johnathan.doeth@hotmail.com")
        self.assertIsInstance(qr, ContactQr)
        self.assertEqual(qr.first_name, 'John')
        self.assertEqual(qr.last_name, 'Doe')
        self.assertEqual(qr.phone, '(212) 555-1234')
        self.assertEqual(qr.email, 'johnathan.doeth@hotmail.com')
        self.assertEqual(qr.filename, 'John-Doe_contact')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'John Doe')
        self.assertEqual(qr.caption[1]['text'], 'johnathan.doeth@hotmail.com\n(212) 555-1234')
        self.assertEqual(len(qr.caption), 2)

        # Confirm attributes have correct instance types
        self.assertIsInstance(qr.caption[0]['font'], PIL.ImageFont.FreeTypeFont)
        self.assertIsInstance(qr.caption[1]['font'], PIL.ImageFont.FreeTypeFont)
        self.assertIsInstance(qr.qr_raw, pyqrcode.QRCode)
        self.assertIsInstance(qr.qr_image, PIL.PngImagePlugin.PngImageFile)
        self.assertIsInstance(qr.qr_complete, PIL.Image.Image)

        # Save, confirm filename
        qr.save()
        self.assertTrue(os.path.exists('John-Doe_contact.png'))

        # Save with non-default name, confirm created, clean up
        qr.save('New_Name.png')
        self.assertTrue(os.path.exists('New_Name.png'))
        os.remove('New_Name.png')

    # Test automatic attribute formatting
    def test_formatting(self):
        # Instantiate with wrong capitalization, confirm corrected
        qr = ContactQr("john", "DOE", "   (212) 555-1234 ", "joHnAtHaN.dOEth@hOtmAiL.cOm")
        self.assertIsInstance(qr, ContactQr)
        self.assertEqual(qr.first_name, 'John')
        self.assertEqual(qr.last_name, 'Doe')
        self.assertEqual(qr.phone, '(212) 555-1234')
        self.assertEqual(qr.email, 'johnathan.doeth@hotmail.com')
        self.assertEqual(qr.filename, 'John-Doe_contact')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'John Doe')
        self.assertEqual(qr.caption[1]['text'], 'johnathan.doeth@hotmail.com\n(212) 555-1234')
        self.assertEqual(len(qr.caption), 2)


class WifiQrTests(TestCase):

    def test_wifi_qr(self):
        # Instantiate, confirm filename
        qr = WifiQr("mywifi", "hunter2")
        self.assertIsInstance(qr, WifiQr)
        self.assertEqual(qr.filename, 'mywifi_Wifi_QR')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'SSID: mywifi ')
        self.assertEqual(qr.caption[1]['text'], 'PASS: hunter2')
        self.assertEqual(len(qr.caption), 2)

        # Confirm attributes have correct instance types
        self.assertIsInstance(qr.caption[0]['font'], PIL.ImageFont.FreeTypeFont)
        self.assertIsInstance(qr.caption[1]['font'], PIL.ImageFont.FreeTypeFont)
        self.assertIsInstance(qr.qr_raw, pyqrcode.QRCode)
        self.assertIsInstance(qr.qr_image, PIL.PngImagePlugin.PngImageFile)
        self.assertIsInstance(qr.qr_complete, PIL.Image.Image)

        # Save, confirm filename
        qr.save()
        self.assertTrue(os.path.exists('mywifi_Wifi_QR.png'))

        # Save with non-default name, confirm created, clean up
        qr.save('New_Name.png')
        self.assertTrue(os.path.exists('New_Name.png'))
        os.remove('New_Name.png')

    def test_wifi_qr_long_password(self):
        # Instantiate, confirm filename
        qr = WifiQr("short", "looooooooooooooooong")
        self.assertIsInstance(qr, WifiQr)
        self.assertEqual(qr.filename, 'short_Wifi_QR')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'SSID:        short        ')
        self.assertEqual(qr.caption[1]['text'], 'PASS: looooooooooooooooong')
        self.assertEqual(len(qr.caption), 2)


class LinkQrTests(TestCase):

    def test_link_qr(self):
        # Instantiate, confirm filename
        qr = LinkQr("https://jamedeus.com")
        self.assertIsInstance(qr, LinkQr)
        self.assertEqual(qr.filename, 'jamedeus.com_QR')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'jamedeus.com')
        self.assertEqual(len(qr.caption), 1)

        # Confirm attributes have correct instance types
        self.assertIsInstance(qr.caption[0]['font'], PIL.ImageFont.FreeTypeFont)
        self.assertIsInstance(qr.qr_raw, pyqrcode.QRCode)
        self.assertIsInstance(qr.qr_image, PIL.PngImagePlugin.PngImageFile)
        self.assertIsInstance(qr.qr_complete, PIL.Image.Image)

        # Save, confirm filename
        qr.save()
        self.assertTrue(os.path.exists('jamedeus.com_QR.png'))

        # Save with non-default name, confirm created, clean up
        qr.save('New_Name.png')
        self.assertTrue(os.path.exists('New_Name.png'))
        os.remove('New_Name.png')

    def test_link_http(self):
        # Instantiate, should remove http:// for filename
        qr = LinkQr("http://jamedeus.com")
        self.assertIsInstance(qr, LinkQr)
        self.assertEqual(qr.filename, 'jamedeus.com_QR')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'jamedeus.com')
        self.assertEqual(len(qr.caption), 1)

    def test_link_no_protocol(self):
        # Instantiate, nothing to remove off for filename
        qr = LinkQr("jamedeus.com")
        self.assertIsInstance(qr, LinkQr)
        self.assertEqual(qr.filename, 'jamedeus.com_QR')

        # Confirm correct text under QR
        self.assertEqual(qr.caption[0]['text'], 'jamedeus.com')
        self.assertEqual(len(qr.caption), 1)
