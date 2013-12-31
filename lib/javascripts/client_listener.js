var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket) {
		Asteroids.socket = socket;

		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ')
		});

		socket.on('testSuccess', function (data) {
			console.log('test received successfully!')
			console.log(data.i)
		});

		socket.on('test', function() {
			console.warn('I receieved test!')
		})

		socket.on('sessionsStatus', function (data){
			console.log(data)
		})
	};

	var sendInfo = global.sendInfo = function (game) {
		// got to send:
		// ship pos, vel, orientation
		var sendParams = {
			// ship: game.ship
		}
		// socket.emit('stepInfo')
	};

})(Asteroids, SocketListener)

