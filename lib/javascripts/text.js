var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// should report ship's health, points, level
	var Readout = global.Readout = function (options) {
		this.game = options.game;
	};

	Readout.prototype.draw = function (ctx) {
		ctx.font = '15pt "Exo 2", sans-serif';
		ctx.fillStyle = 'white';
		var startHeight = 20;
		var lineHeight = 35;
		var h1 = startHeight + lineHeight;
		var h2 = h1 + lineHeight;
		ctx.fillText('Level:  ' + this.game.level, 20, startHeight);
		ctx.fillText('Status:  ' + this.game.status, 20, h1);
		ctx.fillText('Game:  ' + this.game.gameID, 20, h2);


		for (var i = 0; i < this.game.ships.length; i++) {
			var y = h2 + lineHeight + (i * lineHeight);
			ctx.fillStyle = 'white';
			ctx.fillText('Health:        ' + this.game.ships[i].health, 20, y)
			this.game.ships[i].draw(ctx, [107, y - 5], [0, -1])
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	// expanding text from the middle of the screen for level changes, announcesments, etc.
	var ExplodingText = global.ExplodingText = function (options) {
		this.game = options.game;
		this.independentTimer = options.independentTimer;
		this.txt = options.txt || 'default text';
		this.size = options.size || 10;
		this.growRate = options.growRate || 10;
		this.alpha = options.alpha || 1;
		this.alphaChangeRate = options.alphaChangeRate || 0.03;

		this.initialize();
	};

	ExplodingText.prototype.initialize = function() {
		var that = this;

		if (this.independentTimer) {
			var timer = setInterval(function(){
				if (that.alpha <= 0) {
					clearInterval(timer);
				} else {
					// that.draw(that.game.ctx);
					that.game.draw();
				}
			}, this.game.FPS)
		}
	};

	ExplodingText.prototype.draw = function(ctx) {
		ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
		ctx.textAlign = 'center';
		ctx.font = this.size + 'pt "Exo 2", sans-serif';
		var x = this.game.WIDTH / 2;
		var y = (this.game.HEIGHT / 2) + (this.game.HEIGHT / 15);

		ctx.fillText(this.txt, x, y);
		ctx.textAlign = 'left';

		this.size += this.growRate;
		this.alpha -= this.alphaChangeRate;
	};


})(Asteroids);