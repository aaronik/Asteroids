var Asteroids = (this.Asteroids || {});

(function(global){

	Game = global.Game = function(canvasEl) {
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.asteroids = [];
		this.bullets = [];
		this.FPS = 30;
		this.REPOPULATIONRATE = 0.2;
		// this._
		this.bgColor = 'brown';
	};

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.addShip = function() {
		this.ship = new global.Ship();
	};

	Game.prototype.fire = function() {
		this.bullets.push(this.ship.fire());
	}

	Game.prototype.draw = function() {
		var game = this;
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})

		this.bullets.forEach(function(bullet){
			bullet.draw(game.ctx);
		})

		this.ship.draw(this.ctx);
	};

	Game.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		})

		this.ship.move();

		this.bullets.forEach(function(bullet){
			bullet.move();
		})
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

	Game.prototype.clearOOBBullets = function() {
		var bullet;
		var posX;
		var posY;

		for (var i = 0; i < this.bullets.length; i++) {
			bullet = this.bullets[i];
			posX = bullet.pos[0];
			posY = bullet.pos[1];

			if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
				this.bullets.splice(i, 1);
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

	Game.prototype.explodeAsteroidIfHit = function(asteroid) {
		var game = this;
		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWithAsteroid(asteroid)) {
					game.explodeAsteroid(asteroid);
					game.removeBullet(bullet);
				}
			})
		})
	};

	Game.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	}

	Game.prototype.damageShipIfHit = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ship.isCollidedWith(as)) {
				var body = document.getElementsByTagName('body')[0]
				body.bgColor = 'red';
				setTimeout(function(){
					body.bgColor = this.bgColor;
				}, 300)
			}
		})
	};

	Game.prototype.repopulateAsteroids = function() {
		if (typeof this._counter !== "number") {
			this._counter = 0;
		}

		this._counter = (this._counter + 1) % Math.round((this.FPS / this.REPOPULATIONRATE) * 25);
		if (this._counter == 0) {
			this.addAsteroids(1);
		}
	};

	Game.prototype.accelerate = function() {

	};

	Game.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		this.wrapMovingObjects();
		// this.explodeAsteroidsIfCollided();
		this.explodeAsteroidIfHit();
		this.damageShipIfHit();
		this.repopulateAsteroids();
		// this.accelerate();
		this.draw();
		this.move();
	};

	Game.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
		} else {
			this.start();
		}
	};

	Game.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];
	};

	Game.prototype.start = function() {
		var that = this;
		this['mainTimer'] = window.setInterval(function () {
			that.step();
		}, that.FPS);
	};

	Game.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		global.keypressListeners();
		this.start();
		document.getElementsByTagName('body')[0].bgColor = this.bgColor;
	};

})(Asteroids);