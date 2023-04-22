from unittest import TestCase
from ContactQr import *
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
        payload = {'firstName': 'John', 'lastName': 'Doe','phone': '212-555-1234', 'email': 'john.doe@hotmail.com'}
        response = self.app.post('/generate', json=payload, content_type='application/json')
        self.assertEqual(response.status_code, 200)

        # Confirm created, clean up
        self.assertTrue(os.path.exists('John-Doe_contact.png'))
        os.remove('John-Doe_contact.png')

    #def test_download(endpoint(self):
        # TODO implement storage


class ContactQrTests(TestCase):

    def test_contact_qr(self):
        # Instantiate model
        qr = ContactQr("Jogn", "Doe", "212-555-1234", "johnathan.doeth@hotmail.com")
        self.assertIsInstance(qr, ContactQr)

        # Save with non-default name
        qr.save('New_Name.png')

        # Confirm created with custom name, clean up
        self.assertTrue(os.path.exists('New_Name.png'))
        os.remove('New_Name.png')
