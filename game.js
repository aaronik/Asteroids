var Asteroids = (this.Asteroids || {});

(function(global){

	Game = global.Game = function(canvasEl) {
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.asteroids = [];
		this.FPS = 30;
	};

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.draw = function() {
		var game = this;
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})
	};

	Game.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		})
	};

	Game.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.wrapMovingObjects();
		this.draw();
		this.move();
	};

	Game.prototype.clearOOBAsteroids = function() { // substituted for wrap around
		var posX;
		var posY;
		var as;

		for(var i = 0; i < this.asteroids.length; i++){
			as = this.asteroids[i];

			posX = as.pos[0];
			posY = as.pos[1];


			if ((posX - as.RADIUS > this.WIDTH || posX + as.RADIUS < 0) || 
				(posY - as.RADIUS > this.HEIGHT || posY + as.RADIUS < 0)) {
				this.asteroids.splice(i, 1);
				this.addAsteroids(1);
			}
		}
	};

	Game.prototype.wrapMovingObjects = function() {
		var game = this;
		this.asteroids.forEach(function(asteroid){
			if ( (asteroid.pos[0] + asteroid.RADIUS) < 0) {
				asteroid.pos[0] += (game.WIDTH + 2 * asteroid.RADIUS);
			}

			if ( (asteroid.pos[1] + asteroid.RADIUS) < 0) {
				asteroid.pos[1] += (game.HEIGHT + 2 * asteroid.RADIUS);
			}

			if ( (asteroid.pos[0] - asteroid.RADIUS) > game.WIDTH) {
				asteroid.pos[0] -= (game.WIDTH + 2 * asteroid.RADIUS);
			}

			if ( (asteroid.pos[1] - asteroid.RADIUS) > game.HEIGHT) {
				asteroid.pos[1] -= (game.HEIGHT + 2 * asteroid.RADIUS);
			}

			
		})
	};

	Game.prototype.asteroidCollisions = function() {
		var collisions = [];

		for(var i = 0; i < game.asteroids.length; i++){
			for(var j = i + 1; j < game.asteroids.length; j++){
				if ( game.asteroids[i].isCollidedWith(game.asteroids[j]) ) {
					collisions.push(game.asteroids[i]);
					collisions.push(game.asteroids[j]);
				}
			}
		}

		return collisions
	};

	Game.prototype.explodeAsteroid = function(asteroid) {
		var idx = this.asteroids.indexOf(asteroid);
		this.asteroids.splice(idx, 1);
		this.asteroids = this.asteroids.concat(asteroid.explode());
	}

	Game.prototype.start = function() {
		that = this;
		this.addAsteroids(5);
		window.setInterval(function () {
			that.step();
		}, that.FPS);
	};

})(Asteroids);