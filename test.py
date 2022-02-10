from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    
    def setUp(self):
        """things to be done before each test"""
        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']
    
    def test_start(self):
        with self.client:
            response = self.client.get('/')
            self.assertIn('board', session)

    

