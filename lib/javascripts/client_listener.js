var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket, game) {

		// init / general stuff
		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ')
		});

		socket.on('testSuccess', function() {
			console.log('test received successfully!')
			alert('tested')
		});

		socket.on('test', function() {
			console.warn('I receieved test!')
		});

		socket.on('sessionsStatus', function (data) {
			console.log(data)
		});

		socket.on('sessionCreated', function() {
			console.log('session successfully created');
		})

		// game stuff
		socket.on('addAsteroid', function (asteroidOpts) {
			game.addAsteroid(asteroidOpts);
		})
	};

	// var sendInfo = global.sendInfo = function (game) {
	// 	// got to send:
	// 	// ship pos, vel, orientation
	// 	var sendParams = {
	// 		// ship: game.ship
	// 	}
	// 	// socket.emit('stepInfo')
	// };

})(Asteroids, SocketListener)

