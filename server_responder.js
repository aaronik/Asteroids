// OK server_game.js holds all the state, server_listener.js listens for client speak, server_responder.js will give the clients what they ask for.  Not totally sure if this file will be necessary, it may be able to be combined into the server_game.  Either way, it'll interact heavily with the server_game.

// Also one thing to remember is that every event is going to have to have the gameID in it.

var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store

	var ServerResponder = global.ServerResponder = function (socket, io, gameID) {
		// global.ServerSocket.call(this, socket, gameID)
		this.sockets = [socket];
		this.gameID = gameID;
		this.io = io;
		// this.game assigned in server_game.js;
	}

	// Store.inherits(ServerResponder, global.ServerSocket);

	ServerResponder.prototype.sendAsteroid = function (asteroidOpts) {
		this.broadcast('addAsteroid', asteroidOpts);
	}

	ServerResponder.prototype.fireShip = function (socket, data) {
		this.relay(socket, 'fireShip', data);
	}

	ServerResponder.prototype.addShip = function (socket, shipOpts) {
		// can't remember why this is gone
		// this.relay(socket, 'addShip', shipOpts);
	}

	ServerResponder.prototype.removeBullet = function (bulletOpts) {
		this.broadcast('removeBullet', bulletOpts);
	}

	ServerResponder.prototype.powerShip = function (socket, shipOpts) {
		this.relay(socket, 'powerForeignShip', shipOpts);
	}

	ServerResponder.prototype.turnShip = function (socket, turnOpts) {
		this.relay(socket, 'turnForeignShip', turnOpts);
	}

	ServerResponder.prototype.levelUp = function() {
		this.broadcast('levelUp');
	}

	ServerResponder.prototype.sendFullState = function() {
		var fullStateArray = this.game.getFullState();
		var fullStateObject = { fullStateArray: fullStateArray }
		this.broadcast('fullState', fullStateObject);
	}


	// private (esque)
	ServerResponder.prototype.broadcast = function (event, object) {
		this.io.sockets.in(this.gameID).emit(event, object);
	}

	ServerResponder.prototype.relay = function (socket, event, object) {
		socket.broadcast.to(this.gameID).emit(event, object);
	}
})(Asteroids)