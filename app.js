// Module Dependencies
var express = require('express');
// var routes = require('./routes');
var http = require('http');
var path = require('path');
var url = require('url');

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

// app.get('/', routes.index);
// app.get('/new', routes.new);

////////////// routes ///////////////
app.get('/', function (req, res) {
	var min = (req.app.get('env') == 'production') ? ".min" : "";

  res.render('index', { title: "Aaronik's Asteroids", min: min });
})

app.post('/new/', function (req, res) {
	var params = url.parse(req.url, true);
	var width = params.width;
	var height = params.height;

	var gameID = Asteroids.Store.uid(5);
	var socket = createSocket(gameID);

	sessions['serverListener' + gameID] = sl = new Asteroids.ServerListener(socket);
	sessions['serverResponder' + gameID] = sr = new Asteroids.ServerResponder(socket);
	sessions['serverGame' + gameID] = new Asteroids.ServerGame(sl, sr, width, height);
	sessions[gameID] = true;

	res.send({gameID: gameID})
})
//////////////////////////////////////

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);
var Asteroids = require('./Asteroids.js');

var sessions = Asteroids.sessions = new Asteroids.Sessions(); // this guy will aid us in requestSessionsStatus

// per heroku's stupid dumb smelly rules
io.configure(function () {
	io.set("transports", ["xhr-polling"]);
	io.set("polling duration", 10);
});

var createSocket = function (gameID) {
	var ioString = '/' + gameID

	return io.of(ioString);
};