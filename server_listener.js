var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerListener = global.ServerListener = function (socket, gameID) {
		this.socket = socket;
		this.gameID = gameID;
		//this.game is assigned in server_game.js
		this.initialize();
	};

	ServerListener.prototype.initialize = function() {
		var socket = this.socket;
		var gameID = this.gameID;

		socket.on('test', function (data) {
			console.log('test call received');
			socket.broadcast.to(gameID).emit('testSuccess');
		})

	};


})(Asteroids)