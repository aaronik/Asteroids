var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerListener = global.ServerListener = function (socket) {
		this.socket = socket;
		//this.game is assigned in server_game.js
		this.initialize();
	};

	ServerListener.prototype.initialize = function() {
		var socket = this.socket;

		socket.on('connection', function(s) {
			console.log('connected from server_listener')
			socket.emit('connectionSuccessful')
		})

		socket.on('test', function (data) {
			console.log('test call received')
			socket.emit('testSuccess');
		})

	};


})(Asteroids)