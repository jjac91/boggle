from unittest import result
from urllib import response
from boggle import Boggle
from flask import Flask, request, render_template, redirect, flash, session, jsonify
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
    """checks the validity of a word and returns a json response with the result"""
    word = request.args["word"]
    board = session["board"]
    response = boggle.check_valid_word(board, word)
    return jsonify({"result": response})


@app.route("/game-over", methods=["POST"])
def end_game():
    """stores the number of plays in the session, compares the submitted score
     to the current high score and stores the higher of the two scores and 
     returns the number of games played and if the high score was beaten"""
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    plays = session.get("plays", 0)
    session['plays'] = plays + 1
    if score > highscore:
        session["highscore"] = score
        return jsonify({"brokerecord": True, "games": session['plays']})
    else:
        return jsonify({"brokerecord": False, "games": session['plays']})
