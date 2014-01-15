var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Background = global.Background = function (game) {
		this.game = game;
		this.numStars = 200;
		this.stars = [];
		this.starOptions = {
			'height': this.game.HEIGHT,
			'width': this.game.WIDTH
		};
		this.initialize();
	}

	Background.prototype.initialize = function () {
		for (var i = 0; i < this.numStars; i++) {
			this.stars.push(new global.Star(this.starOptions))
		}
	};

	Background.prototype.draw = function (ctx) {
		this.stars.forEach(function(star){
			star.draw(ctx);
		})
	};

	Background.prototype.move = function() {
		this.detect();

		this.stars.forEach(function(star){
			star.move();
		})
	}

	Background.prototype.detectOOBStars = function() {
		var bg = this;

		this.stars.forEach(function(star){
			if ( (star.pos[0] + star.radius) < 0) {
				star.die();
			}

			if ( (star.pos[1] + star.radius) < 0) {
				star.die();
			}

			if ( (star.pos[0] - star.radius) > game.WIDTH) {
				star.die();
			}

			if ( (star.pos[1] - star.radius) > game.HEIGHT) {
				star.die();
			}	
		})
	};

	Background.prototype.detectDeadStars = function() {
		var bg = this;

		this.stars.forEach(function (star) {
			if (!star.alive) bg.replaceStar(star);
		})
	};

	Background.prototype.replaceStar = function (star) {
		this.stars.remove(star);
		this.stars.push(new global.Star(this.starOptions))
	}

	Background.prototype.detect = function() {
		this.detectOOBStars();
		this.detectDeadStars();
	}
})(Asteroids);