// Module Dependencies
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

process.on('uncaughtException', function (error) {
	console.warn('OUUUCHHHHH... Handling an uncaught exception!!!');
	console.error(error.stack);
})

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
var Asteroids = require('./Asteroids.js');
var sessions = new Asteroids.Sessions(); // this guy will aid us in requestSessionsStatus

// Begin socket listeners
io.sockets.on('connection', function (socket) {
	socket.emit('connectionSuccessful');

	socket.on('requestSessionsStatus', function() {
		socket.emit('sessionsStatus', sessions.keys());
	})

	// Host a Multiplayer Game
	socket.on('hmpg', function (data) {
		var gameID = Asteroids.Store.uid(5);
		var width = data.width;
		var height = data.height;

		sessions['serverListener' + gameID] = sl = new Asteroids.ServerListener(socket, io, gameID);
		sessions['serverResponder' + gameID] = sr = new Asteroids.ServerResponder(socket, io, gameID, sessions);
		sessions['serverGame' + gameID] = new Asteroids.ServerGame(sl, sr, width, height);
		sessions[gameID] = true;

		socket.join(gameID);
		socket.emit('hmpgResponse', { gameID: gameID })

		setDecay(gameID);
	})

	// Join a Designated Multiplayer Game
	socket.on('jmpg', function (data) {
		var gameID = data.gameID;
		var width = data.width;
		var height = data.height;

		if (sessions.keys().indexOf(gameID) != -1) {
			socket.join(gameID);
			sessions['serverListener' + gameID].addSocket(socket);

			socket.emit('jmpgSuccess');
			socket.broadcast.to(gameID).emit('foreignJoin')
		} else {
			socket.emit('jmpgNoGame');
		}

		setDecay(gameID);
	})

	// Join a Random Multiplayer Game
	socket.on('jrmpg', function (data) {
		var gameID = sessions.randomSession();
		if (!gameID) {
			socket.emit('jrmpgFailure', { error: 'Sorry, no games to join!' });
			return
		}
		console.log('jrmpg called, gameID retrieved was ' + gameID);
		var width = data.width;
		var height = data.height;

		socket.join(gameID);
		sessions['serverListener' + gameID].addSocket(socket);

		// socket.set('gameID', gameID); // works?
		socket.emit('jrmpgSuccess', { gameID: gameID })
		socket.broadcast.to(gameID).emit('foreignJoin')

		setDecay(gameID);
	})
});

// socket helpers
function setDecay (gameID) {
	setTimeout(function() {
		removeSession(gameID);
	}, 3600000)
}

function removeSession (gameID) {
	sessions['serverListener' + gameID] = null;
	sessions['serverResponder' + gameID] = null;
	sessions['serverGame' + gameID] = null;
	sessions[gameID] = false;
}
