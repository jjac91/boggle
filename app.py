from unittest import result
from urllib import response
from boggle import Boggle
from flask import Flask, request, render_template,redirect,flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "oh-so-secret"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

boggle = Boggle()

@app.route("/")
def start_game():
    """returns a page with a new boggle board"""
    board = boggle.make_board()
    session["board"] = board
    return render_template("boggle.html", board=board)

@app.route("/is-word")
def is_word():
    word = request.args["word"]
    board = session["board"]
    response = boggle.check_valid_word(board, word)
    return jsonify({"result":response})
