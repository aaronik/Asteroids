window.onload = function() {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", "1000");
	canvas.setAttribute("height", "500");

	var canvasWrapper = document.getElementById("canvas-wrapper");
	canvasWrapper.appendChild(canvas);

	var game = new window.Asteroids.Game(canvas);
	game.initialize();

	window.game = game;

	// fire up socket
	var socket = io.connect('/');
	window.socket = socket;
	Asteroids.SocketListener.startListening(socket);
}