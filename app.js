// Module Dependencies
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var io 

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

// per heroku's stupid dumb smelly rules
io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});

io.sockets.on('connection', function (socket) {
	socket.emit('connectionSuccessful');
	socket.on('test', function() {
		console.log('test received, emitting response');
		socket.emit('testSuccess');
	});
});

// io.sockets.on('connection', function (socket) {
// 	socket.emit('connectionSuccessful');
// 	socket.on('test', function() {
// 		console.log('test received, emitting response');
// 		socket.emit('testSuccess');
// 	});

// 	socket.on('requestRandomAsteroidParams', function (data) {
// 		console.log('received request for rand asteroid params');
// 		var number = data.number;
// 		var dimX = data.dimX;
// 		var dimY = data.dimY;

// 		var returnParams = {};

// 		for (i = 0; i < number; i++) {
// 			returnParams[i] = Asteroids.Asteroid.randomAsteroidParams(dimX, dimY)
// 		};

// 		socket.emit('returnRequestForRandomAsteroidParams', returnParams);
// 		console.log('sent rand asteroid params')
// 	});

// 	socket.on('changeAsteroidSpeed', function (data){
// 		socket.emit('changeAsteroidSpeed', data);
// 	})
// });