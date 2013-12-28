var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// should report ship's health, points, level
	var Readout = global.Readout = function (options) {
		this.ship = options.ship;
		this.game = options.game;
	};

	Readout.prototype.draw = function (ctx) {
		ctx.font = 'bold 15pt normal';
		ctx.fillStyle = 'white';
		ctx.fillText('Health: ' + this.ship.health, 20, 20);
		ctx.fillText('Level: ' + this.game.level, 20, 50);
	};

	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	// expanding text from the middle of the screen for level changes, announcesments, etc.
	var ExplodingText = global.ExplodingText = function (options) {
		this.game = options.game;
		this.txt = options.txt || 'default text';
		this.size = options.size || 10;
		this.growRate = options.growRate || 10;
		this.alpha = options.alpha || 1;
		this.alphaChangeRate = options.alphaChangeRate || 0.05;
	};

	ExplodingText.prototype.draw = function(ctx) {
		ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
		ctx.textAlign = 'center';
		ctx.font = 'bold ' + this.size + 'pt normal';
		var x = this.game.WIDTH / 2;
		var y = (this.game.HEIGHT / 2) + (this.game.HEIGHT / 20);

		ctx.fillText(this.txt, x, y);
		ctx.textAlign = 'left';

		this.size += this.growRate;
		this.alpha -= this.alphaChangeRate;
	};


})(Asteroids);