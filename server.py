import flask

app = flask.Flask(__name__)

@app.route("/")
def Home_page():
	return flask.render_template("home.html")

@app.route("/astar")
def Astar_page():
	return flask.render_template("Astar.html")

@app.route("/claster")
def Claster_page():
	return flask.render_template("KL.html")

@app.route("/genetic")
def Gen_algorithm():
	return flask.render_template("genetic.html")

if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0")