from unittest import TestCase
from ContactQr import *
from WifiQr import *
from LinkQr import *
from app import app
import json, os



class EndpointTests(TestCase):
    def setUp(self):
        self.app = app.test_client()

    def test_index(self):
        # Send request, confirm status
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)

    def test_generate_endpoint(self):
        # Send request, confirm status
        payload = {'firstName': 'John', 'lastName': 'Doe','phone': '212-555-1234', 'email': 'john.doe@hotmail.com', 'type': 'contact-qr'}
        response = self.app.post('/generate', json=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Confirm created, clean up
        self.assertTrue(os.path.exists('John-Doe_contact.png'))
        os.remove('John-Doe_contact.png')

    def test_wifi_qr(self):
        # Send request, confirm status
        payload = {'ssid': 'AzureDiamond', 'password': 'hunter2', 'type': 'wifi-qr'}
        response = self.app.post('/generate', json=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Confirm created, clean up
        self.assertTrue(os.path.exists('AzureDiamond_Wifi_QR.png'))
        os.remove('AzureDiamond_Wifi_QR.png')

    def test_wifi_qr_longer_password(self):
        # Send request, confirm status
        payload = {'ssid': 'mynet', 'password': 'hunter2', 'type': 'wifi-qr'}
        response = self.app.post('/generate', json=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Confirm created, clean up
        self.assertTrue(os.path.exists('mynet_Wifi_QR.png'))
        os.remove('mynet_Wifi_QR.png')

    def test_link_qr(self):
        # Send request, confirm status
        payload = {'url': 'https://jamedeus.com', 'type': 'link-qr'}
        response = self.app.post('/generate', json=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Confirm created, clean up
        self.assertTrue(os.path.exists('jamedeus.com_QR.png'))
        os.remove('jamedeus.com_QR.png')

    def test_http_link_qr(self):
        # Send request, confirm status
        payload = {'url': 'http://jamedeus.com', 'type': 'link-qr'}
        response = self.app.post('/generate', json=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Confirm created, clean up
        self.assertTrue(os.path.exists('jamedeus.com_QR.png'))
        os.remove('jamedeus.com_QR.png')

    #def test_download(endpoint(self):
        # TODO implement storage


class ContactQrTests(TestCase):

    def test_contact_qr(self):
        # Instantiate, confirm attributes
        qr = ContactQr("John", "Doe", "(212) 555-1234", "johnathan.doeth@hotmail.com")
        self.assertIsInstance(qr, ContactQr)
        self.assertEqual(qr.first_name, 'John')
        self.assertEqual(qr.last_name, 'Doe')
        self.assertEqual(qr.phone, '(212) 555-1234')
        self.assertEqual(qr.email, 'johnathan.doeth@hotmail.com')

        # Save, confirm filename
        self.assertEqual(qr.filename, 'John-Doe_contact')
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


class WifiQrTests(TestCase):

    def test_wifi_qr(self):
        # Instantiate
        qr = WifiQr("mywifi", "hunter2")
        self.assertIsInstance(qr, WifiQr)

        # Save, confirm filename
        self.assertEqual(qr.filename, 'mywifi_Wifi_QR')
        qr.save()
        self.assertTrue(os.path.exists('mywifi_Wifi_QR.png'))

        # Save with non-default name, confirm created, clean up
        qr.save('New_Name.png')
        self.assertTrue(os.path.exists('New_Name.png'))
        os.remove('New_Name.png')


class LinkQrTests(TestCase):

    def test_link_qr(self):
        # Instantiate
        qr = LinkQr("https://jamedeus.com")
        self.assertIsInstance(qr, LinkQr)
        self.assertEqual(qr.filename, 'jamedeus.com_QR')

        # Save, confirm filename
        qr.save()
        self.assertTrue(os.path.exists('jamedeus.com_QR.png'))

        # Save with non-default name, confirm created, clean up
        qr.save('New_Name.png')
        self.assertTrue(os.path.exists('New_Name.png'))
        os.remove('New_Name.png')
