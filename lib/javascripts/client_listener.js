var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket, game) {
		var debugFlag = true;

		function debug (log) {
			if (debugFlag) console.log(log)
		}

		// init / general stuff
		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ');
			game.status = 'connected';
		});

		socket.on('reconnecting', function() {
			console.log('reconnecting to server...');
			game.status = 'reconnecting...';
		})

		socket.on('reconnect_failed', function() {
			conosole.log('Damn, can\'t reconect to the server!');
			game.status = 'disconnected!  =\'('
		})

		socket.on('testSuccess', function() {
			console.log('test received successfully!')
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

		socket.on('foreignJoin', function() {
			console.log('Another user has joined the room');
		})

		// game stuff
		socket.on('addAsteroid', function (asteroidOpts) {
			debug('received asteroid')
			game.addAsteroid(asteroidOpts);
		})

		socket.on('fireShip', function (data) {
			debug('firing foreign ship')
			game.fireForeignShip(data.shipID);
		})

		socket.on('addShip', function (shipOpts) {
			debug('add foreign ship')
			game.addForeignShip(shipOpts);
		})

		socket.on('removeBullet', function (bulletOpts) {
			debug('remove bullet')
			game.foreignRemoveBullet(bulletOpts);
		})

		socket.on('powerForeignShip', function (shipOpts) {
			game.powerForeignShip(shipOpts.shipID);
		})

		socket.on('turnForeignShip', function (turnOpts) {
			game.turnForeignShip(turnOpts);
		})

		socket.on('levelUp', function() {
			game.levelUp();
		})

		socket.on('fullState', function (fullStateObject) {
			game.handleFullState(fullStateObject);
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

