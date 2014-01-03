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

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
var Asteroids = require('./Asteroids.js');

var sessions = new Asteroids.Sessions(); // this guy will aid us in requestSessionsStatus

// per heroku's stupid dumb smelly rules
io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
	socket.emit('connectionSuccessful');

	socket.on('requestSessionsStatus', function() {
		socket.emit('sessionsStatus', sessions.keys());
	})

	// Initialize a new game
	socket.on('hmpg', function (data) {
		var gameID = Asteroids.Store.uid(5);
		var width = data.width;
		var height = data.height;

		sessions['serverListener' + gameID] = sl = new Asteroids.ServerListener(socket, gameID);
		sessions['serverResponder' + gameID] = sr = new Asteroids.ServerResponder(socket, gameID);
		sessions['serverGame' + gameID] = new Asteroids.ServerGame(sl, sr, width, height);
		sessions[gameID] = true;

		socket.join(gameID);
		socket.emit('hmpgResponse', { gameID: gameID })
	})

	socket.on('jrmpg', function (data) {
		var gameID = sessions.randomSession();
		console.log('jrmpg called, gameID retrieved was ' + gameID)
		var width = data.width;
		var height = data.height;

		socket.join(gameID);
		socket.emit('jrmpgResponse', { gameID: gameID })
		socket.broadcast.to(gameID).emit('nutha folks has arrived.')
	})
});

