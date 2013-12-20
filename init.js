window.onload = function() {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", "500");
	canvas.setAttribute("height", "500");
	canvas.setAttribute("background", 'black');

	var canvasWrapper = document.getElementById("canvas-wrapper");
	canvasWrapper.appendChild(canvas);

	var game = new window.Asteroids.Game(canvas);
	game.initialize();

	window.game = game;
}