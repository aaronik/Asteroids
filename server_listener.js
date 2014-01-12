var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ServerListener = global.ServerListener = function (socket, io, gameID) {
		this.sockets = [socket];
		this.gameID = gameID;
		this.io = io;
		// this.game is assigned in server_game.js
	};


	ServerListener.prototype.initialize = function() {
		var that = this;
		var gameID = this.gameID;
		var game = this.game;
		var sr = this.game.serverResponder;

		this.sockets.forEach(function(socket){

			socket.removeAllListeners();

			socket.on('test', function (data) {
				console.log('test call received');
				sr.testSuccess();
			})

			socket.on('requestSessionsStatus', function() {
				console.log('emitting sessions status');
				sr.requestSessionsStatus();
			})

			// game
			socket.on('fireShip', function (bulletOpts) {
				game.fireShip(null, bulletOpts);
				sr.fireShip(socket, bulletOpts);
			})

			socket.on('addShip', function (shipOpts) {
				game.addShip(shipOpts);
				sr.addShip(socket, shipOpts);
				socket.shipID = shipOpts.id;
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

			socket.on('dampenShip', function (dampenOpts) {
				game.dampenShip(dampenOpts);
				sr.dampenShip(socket, dampenOpts);
			})

			socket.on('requestFullState', function() {
				sr.sendFullState();
			})

			socket.on('shipState', function (shipOpts) {
				game.updateShip(shipOpts);
			})

			socket.on('pause', function() {
				game.pause();
				sr.pause(socket);
			})

			socket.on('disconnect', function() {
				that[socket.id] = setTimeout(function() {
					that.removeSocket(socket);
				}, 15000)
			})

			socket.on('connection', function() {
				if (that[socket.id]) {
					clearTimeout(that[socket.sessionid]);
				}
			})
		})

	};

	ServerListener.prototype.addSocket = function (socket) {
		this.sockets.push(socket);
		this.initialize();
		this.game.serverResponder.sendFullState();
	};

	ServerListener.prototype.removeSocket = function (socket) {
		socket.removeAllListeners();
		this.sockets.remove(socket);
		this.initialize();
		this.game.removeShip(socket.shipID);
	};

})(Asteroids)