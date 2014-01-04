var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Background = global.Background = function (game) {
		this.game = game;
		this.numStars = 200;
		this.stars = [];
		this.initialize();
	}

	Background.prototype.initialize = function () {
		var stars = [];
		var starOptions = {
			'height': this.game.HEIGHT,
			'width': this.game.WIDTH
		}

		for (var i = 0; i < this.numStars; i++) {
			this.stars.push(new global.Star(starOptions))
		}
	};

	Background.prototype.draw = function (ctx) {
		this.stars.forEach(function(star){
			star.draw(ctx);
		})
	};

	Background.prototype.move = function() {
		this.stars.forEach(function(star){
			star.move();
		})
	}
})(Asteroids);