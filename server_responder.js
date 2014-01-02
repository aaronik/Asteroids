// OK server_game.js holds all the state, server_listener.js listens for client speak, server_responder.js will give the clients what they ask for.  Not totally sure if this file will be necessary, it may be able to be combined into the server_game.  Either way, it'll interact heavily with the server_game.

// Also one thing to remember is that every event is going to have to have the gameID in it.

var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerResponder = global.ServerResponder = function (socket, gameID) {
		this.socket = socket;
		this.gameID = gameID;
		global.gameID = gameID;
		// this.game assigned in server_game.js;
	}

	ServerResponder.prototype.sendAsteroid = function (asteroidOpts) {
		console.log('sending asteroids down')
		console.log('called with ' + st('addAsteroid'))
		console.log('gameID is ' + this.gameID)
		this.socket.emit(st('addAsteroid'), asteroidOpts);
	}

	var st = function (str) {
		return str + global.gameID;
	}
})(Asteroids)