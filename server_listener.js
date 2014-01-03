var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ServerListener = global.ServerListener = function (socket, io, gameID) {
		// global.ServerSocket.call(this, socket, gameID);
		this.sockets = [socket];
		this.gameID = gameID;
		this.io = io;
		//this.game is assigned in server_game.js
		// this.initialize();
	};

	// Store.inherits(ServerListener, global.ServerSocket);

	ServerListener.prototype.initialize = function() {
		var that = this;
		var gameID = this.gameID;
		var game = this.game;
		var sr = this.game.serverResponder;

		this.sockets.forEach(function(socket){

			socket.removeAllListeners();

			socket.on('test', function (data) {
				console.log('test call received');
				that.broadcast('testSuccess');
			})

			// game
			socket.on('createBullet', function (bulletOpts) {
				game.fireShip(null, bulletOpts);
				sr.fireShip(socket, bulletOpts);
			})

			socket.on('addShip', function (shipOpts) {
				game.addShip(shipOpts);
				sr.addShip(socket, shipOpts);
			})

			socket.on('powerShip', function (shipOpts) {
				var ship = game.get(shipOpts.shipID);
				game.powerShip(ship);
				sr.powerShip(socket, shipOpts);
			})

			socket.on('turnShip', function (turnOpts) {
				game.turnShip(turnOpts);
				sr.turnShip(socket, turnOpts);
			})

			socket.on('requestFullState', function() {
				sr.sendFullState();
			})

			socket.on('shipState', function (shipOpts) {
				game.updateShip(shipOpts);
			})
		})

	};

	ServerListener.prototype.addSocket = function (socket) {
		this.sockets.push(socket);
		this.initialize();
		this.game.serverResponder.sendFullState();
	};

	ServerListener.prototype.broadcast = function (event, object) {
		this.io.sockets.in(this.gameID).emit(event, object);
	};




})(Asteroids)