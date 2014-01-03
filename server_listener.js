var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerListener = global.ServerListener = function (socket) {
		this.socket = socket;
		//this.game is assigned in server_game.js
		this.initialize();
	};

	ServerListener.prototype.initialize = function() {
		var socket = this.socket;

		socket.on('test', function (data) {
			console.log('test call received');
			socket.broadcast.emit('testSuccess');
		})

	};


})(Asteroids)