var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerSocket = global.ServerSocket = function (socket, gameID) {
		this.sockets = [socket];
		this.gameID = gameID;
	}

	ServerSocket.prototype.hear = function (event, callback) {
		this.sockets.forEach(function(socket){
			socket.on(event, callback)
		})
	}

	ServerSocket.prototype.relay = function (event, object) {
		
	}
})(Asteroids)