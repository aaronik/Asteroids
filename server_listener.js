var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerListener = global.ServerListener = function (nsSocket) {
		this.nsSocket = nsSocket;
		//this.game is assigned in server_game.js
		this.initialize();
	};

	ServerListener.prototype.initialize = function() {
		var nsSocket = this.nsSocket;

		nsSocket.on('connection', function(socket) {
			console.log('connected from server_listener')
			socket.emit('connectionSuccessful')

			socket.on('test', function (data) {
				console.log('test call received')
				nsSocket.emit('testSuccess');
			})
		})

	};


})(Asteroids)