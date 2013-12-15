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

	Game.prototype.addShip = function() {
		this.ship = new global.Ship();
	};

	Game.prototype.draw = function() {
		var game = this;
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})

		this.ship.draw(this.ctx);
	};

	Game.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		})

		this.ship.move();
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

		var movingObjects = [];
		movingObjects = movingObjects.concat(game.asteroids);
		movingOBjects = movingObjects.push(game.ship);

		movingObjects.forEach(function(object){
			if ( (object.pos[0] + object.radius) < 0) {
				object.pos[0] += (game.WIDTH + 2 * object.radius);
			}

			if ( (object.pos[1] + object.radius) < 0) {
				object.pos[1] += (game.HEIGHT + 2 * object.radius);
			}

			if ( (object.pos[0] - object.radius) > game.WIDTH) {
				object.pos[0] -= (game.WIDTH + 2 * object.radius);
			}

			if ( (object.pos[1] - object.radius) > game.HEIGHT) {
				object.pos[1] -= (game.HEIGHT + 2 * object.radius);
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

	Game.prototype.explodeAsteroidsIfCollided = function() {
		var game = this;
		this.asteroidCollisions().forEach(function(asteroid){
			game.explodeAsteroid(asteroid);
		})
	};

	Game.prototype.explodeAsteroid = function(asteroid) {
		var idx = this.asteroids.indexOf(asteroid);
		this.asteroids.splice(idx, 1);
		this.asteroids = this.asteroids.concat(asteroid.explode());
	};

	Game.prototype.damageShipIfHit = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ship.isCollidedWith(as)) {
				console.log("boom!")
			}
		})
	};

	Game.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.wrapMovingObjects();
		// this.explodeAsteroidsIfCollided();
		this.damageShipIfHit();
		this.draw();
		this.move();
	};

	Game.prototype.start = function() {
		that = this;
		this.addAsteroids(5);
		this.addShip();
		global.keypressListeners();
		window.setInterval(function () {
			that.step();
		}, that.FPS);
	};

})(Asteroids);