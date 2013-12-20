
// Module Dependencies
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var compressor = require('node-minify');

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

// JS concatenation / minification options
// helpers
var d = new Date();
var dateString = String(d.getFullYear()) + d.getMonth() + d.getDay() + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();

// important vars
var outFile = "public/javascripts/" + dateString + "application.js";
// console.log(typeof outFile)
var inFile = ['array.js', 'inherits.js', 'store.js', 'moving_object.js', 'asteroid.js', 'game.js', 'ship.js', 'key_listener.js', 'bullet.js', 'visuals.js', 'init.js'];
// console.log(inFile)

var minOptions = {
	fileIn: "public/javascripts/application.js",
	fileOut: outFile,
	callback: function(err, min){
		console.log(err);
		console.log(min);
	}
};

var developmentMinOptions = Object.create(minOptions, {type: {value: 'no-compress'}});
var productionMinOptions = Object.create(minOptions, {type: {value: 'uglifyjs'}});

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	new compressor.minify(developmentMinOptions);
} else {
	new compressor.minify(productionMinOptions);
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
