var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ServerListener = global.ServerListener = function (socket, gameID) {
		this.socket = socket;
		this.gameID = gameID;
		//this.game is assigned in server_game.js
	};

	ServerListener.prototype.eventString = function (event) {
		return event + this.gameID;
	}

	ServerListener.prototype.initialize = function() {
		var eventString;

		eventString = this.eventString('')
		this.socket.on(eventString, function (data) {
			
		})

	};


})(Asteroids)