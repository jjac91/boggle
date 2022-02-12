from cgitb import html
from unittest import TestCase
from urllib import response
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
        """tests that the correct page is opened"""
        with self.client:
            response = self.client.get('/')
            html = response.get_data(as_text=True)
            self.assertIn('board', session)
            self.assertIn('Boggle!', html)

    def test_on_board(self):
        """Tests that word is valid on the board"""
        with self.client as client:
            with client.session_transaction() as session_test:
                session_test['board'] = [["W", "E", "T", "W", "E"],
                                         ["A", "A", "G", "R", "B"],
                                         ["F", "A", "H", "Q", "N"],
                                         ["F", "A", "J", "T", "H"],
                                         ["L", "E", "H", "T", "T"]]

            response = self.client.get('/is-word?word=waffle')
            self.assertEqual(response.json['result'], 'ok')

    def test_in_dictionary(self):
        """Tests that word is in the wordlist but not on the board"""
        self.client.get("/")
        response = self.client.get('/is-word?word=abreaction')
        self.assertEqual(response.json['result'], 'not-on-board')

    def test_in_gibberish(self):
        """Tests that word is in the wordlist but not on the board"""
        self.client.get("/")
        response = self.client.get('/is-word?word=adfgfgfdsgdfsgdf')
        self.assertEqual(response.json['result'], 'not-word')

    def test_highscore(self):
        """Tests the response if the highscore is broken"""
        with self.client:
            self.client.post("/game-over", data={'score': 2})
        self.assertEqual(response.json(
            {"brokerecord": True, "games": 1}))
