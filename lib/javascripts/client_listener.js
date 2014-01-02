var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket, gameID) {
		global.gameID = gameID;

		// init / general stuff
		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ')
		});

		socket.on('testSuccess', function() {
			console.log('test received successfully!')
		});

		socket.on('test', function() {
			console.warn('I receieved test!')
		});

		socket.on('sessionsStatus', function (data) {
			console.log(data)
		});

		socket.on(st('sessionCreated'), function() {
			console.log('session successfully created');
		})

		// game stuff
		socket.on(st('addAsteroid'), function (asteroidOpts) {
			console.log('SocketListener received addAsteroid call')
			Asteroids.game.addAsteroid(asteroidOpts)
		})
	};

	var st = function (string) {
		return string + Asteroids.gameID;
	}

	// var sendInfo = global.sendInfo = function (game) {
	// 	// got to send:
	// 	// ship pos, vel, orientation
	// 	var sendParams = {
	// 		// ship: game.ship
	// 	}
	// 	// socket.emit('stepInfo')
	// };

})(Asteroids, SocketListener)

