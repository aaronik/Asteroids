var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var GameStarter = global.GameStarter = function (gameType) {
		this.started = false;
		this.initialize(gameType);
	};

	GameStarter.prototype.initialize = function (gameType) {
		switch (gameType) {
			case 'sp':
				this.startSinglePlayerGame();
				break;
			case 'hmpg':
				this.hostMultiPlayerGame();
				break;
			case 'jmpg':
				this.createRequestScreen();
				// this.joinMultiPlayerGame();
				break;
			case 'jrmpg':
				this.joinRandomMultiPlayerGame();
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
		var game = new global.GameMP(canvas);
		window.game = game;
		var socket = io.connect('/');
		window.socket = socket;
		game.socket = socket;

		socket.on('connect', function(){
			if (!this.started) {
				socket.emit('hmpg', { width: game.WIDTH, height: game.HEIGHT });
				Asteroids.SocketListener.startListening(socket, game);
				this.started = true;
				game.initialize();
			}
		})

		socket.on('hmpgResponse', function (data) {
			console.log('successfully created room: ' + data.gameID);
			game.gameID = data.gameID;
		})
	}

	GameStarter.prototype.joinMultiPlayerGame = function (gameID) {
		var canvas = this.createCanvas();
		var game = new global.GameMP(canvas);
		window.game = game;
		var socket = io.connect('/');
		window.socket = socket;
		game.socket = socket;

		socket.on('connect', function() {
			if (!this.started) {
				socket.emit('jmpg', { width: game.WIDTH, height: game.HEIGHT, gameID: gameID })
			}

			socket.on('jmpgSuccess', function() {
				Asteroids.SocketListener.startListening(socket, game);
				this.started = true;
				game.initialize();
			})

			socket.on('jmpgNoGame', function() {
				alert('Sorry, couldn\'t find your game!');
				window.location = document.URL;
			})

			socket.on('jmpgFailure', function() {
				alert("Sorry, something totally bizarre happened!");
				window.location = document.URL;
			})
		})
	};

	GameStarter.prototype.joinRandomMultiPlayerGame = function() {
		var canvas = this.createCanvas();
		var game = new global.GameMP(canvas);
		window.game = game;
		var socket = io.connect('/');
		window.socket = socket;
		game.socket = socket;

		socket.on('connect', function() {
			if (!this.started) {
				socket.emit('jrmpg', { width: game.WIDTH, height: game.HEIGHT });
				Asteroids.SocketListener.startListening(socket, game);
				this.started = true;
				game.initialize();
			}
		})

		socket.on('jrmpgSuccess', function (data) {
			console.log('successfully joined room: ' + data.gameID);
			game.gameID = data.gameID;
		})

		socket.on('jrmpgFailure', function (data) {
			console.log(data.error)
			alert(data.error);
			window.location = document.URL;
		})
	};

	GameStarter.prototype.createCanvas = function() {
		var canvasWrapper = document.createElement('div');
		canvasWrapper.id = 'canvas-wrapper';
		document.body.appendChild(canvasWrapper);

		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "1000");
		canvas.setAttribute("height", "500");

		canvasWrapper.appendChild(canvas);

		return canvas;
	};

	// GameStarter.prototype.createGame = function (canvas) {
	// 	var game = new global.GameMP(canvas);
	// 	window.game = game;
	// }

	GameStarter.prototype.createRequestScreen = function() {
		var that = this;

		var el = document.getElementById('session-request');
		var form = document.getElementById('session-request-form');
		var textField = document.getElementById('session-request-input');

		// make it invisible but present
		el.setAttribute('style', 'opacity:0; display:block;');

		global.Visuals.fade(el, 0, 1, 0.2);

		form.onsubmit = function(e) {
			e.preventDefault();
			global.Visuals.fade(el, 1, 0, -0.2, function(){
				el.remove();
				that.joinMultiPlayerGame(textField.value);
			});
		}
	}

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

			Asteroids.Visuals.fade(footer, 1, 0, -0.3);
			Asteroids.Visuals.fade(lopwerPaneWrapper, 1, 0, -0.1);
			setTimeout(function(){
				Asteroids.Visuals.fade(mainWrapper, 1, 0, -0.2, function(){
					document.getElementById('main-wrapper').remove();

					new Asteroids.GameStarter(data.target.id)
				});
			}, 300)
		}
	);

}
