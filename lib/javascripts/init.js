var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var GameStarter = global.GameStarter = function (gameType) {
		this.initialize(gameType);
	};

	GameStarter.prototype.initialize = function (gameType) {
		switch (gameType) {
			case 'sp':
				this.startSinglePlayerGame();
				break;
			case 'hmpg':
				this.hostMultiPlayerGame();
				// this.notAvailable();
				break;
			case 'jmpg':
				// this.joinMultiPlayerGame();
				this.notAvailable();
				break;
			case 'jrmpg':
				// this.joinRandomMultiPlayerGame();
				this.notAvailable();
				break;
		}
	};

	GameStarter.prototype.startSinglePlayerGame = function() {
		var canvas = this.createCanvas();
		var game = new global.Game(canvas);

		window.game = game;
	};

	GameStarter.prototype.notAvailable = function() {
		alert('sorry, not available yet!')
		window.location = document.URL;
	};

	GameStarter.prototype.hostMultiPlayerGame = function() {
		var canvas = this.createCanvas();
		var game = this.createGame(canvas);

		// this.createSocket(this.createGame, canvas);
		var socket = io.connect('/');

		var nsSocket;
		socket.emit('createSession', { width: game.WIDTH, height: game.HEIGHT })
		socket.on('sessionCreated', function (data) {
			var socketLocation = '/' + data.socketLocation;
			console.log('init.js#hostMultiPlayerGame - received new socket loc')
			console.log(socketLocation)
			// socket.disconnect();
			window.sock = socket;
			// nsSocket = io.connect(socketLocation);

			// game.socket = nsSocket;
			// global.SocketListener.startListening(nsSocket, game);
			// game.initialize();
			// window.socket = nsSocket;
			// global.socket = nsSocket;
		})
	};

	GameStarter.prototype.hostMultiPlayerGame = function() {
		var canvas = this.createCanvas();
		var game = this.createGame(canvas);
		window.game = game;

		var req = new XMLHttpRequest();
		req.addEventListener('load', function(event){
			var gameID = JSON.parse(event.target.response).gameID;
			
			var socket = io.connect('/' + gameID)
			game.socket = socket;
			global.SocketListener.startListening(socket, game);
			game.initialize();
			window.socket = socket;
		}, false)

		var url = '/new/?width=' + game.WIDTH + '&height=' + game.HEIGHT;
		req.open('POST', url, true);
		req.send();
	};

	GameStarter.prototype.joinMultiPlayerGame = function() {
		
	};

	GameStarter.prototype.joinRandomMultiPlayerGame = function() {

	};

	GameStarter.prototype.createGame = function (canvas) {
		var game = new global.GameMP(canvas);
		window.game = game;
		return game;
	}

	GameStarter.prototype.createCanvas = function() {
		var canvasWrapper = document.createElement('div')
		canvasWrapper.id = 'canvas-wrapper';
		document.body.appendChild(canvasWrapper);

		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "1000");
		canvas.setAttribute("height", "500");

		canvasWrapper.appendChild(canvas);

		return canvas;
	};

	GameStarter.prototype.createSocket = function (callback, canvas) {

	};

})(Asteroids)

window.onload = function() {

	// let's handle that index page
	var bs = document.getElementsByClassName('button');
	Asteroids.Store.assignOnclickToNodeList(bs, 
		function(data){
			// handle what should actually happen

			var lopwerPaneWrapper = document.getElementById('lower-pane-wrapper');
			var footer = document.getElementsByTagName('footer')[0];
			var mainWrapper = document.getElementById('main-wrapper');

			Asteroids.Visuals.fadeOut(footer, 0.3);
			Asteroids.Visuals.fadeOut(lopwerPaneWrapper, 0.1);
			setTimeout(function(){
				Asteroids.Visuals.fadeOut(mainWrapper, 0.2, function(){
					document.getElementById('main-wrapper').remove();

					new Asteroids.GameStarter(data.toElement.id)
				});
			}, 300)
		}
	);
	
}