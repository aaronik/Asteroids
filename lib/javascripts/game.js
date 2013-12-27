var Asteroids = (this.Asteroids || {});

(function(global){

	Game = global.Game = function(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.FPS = 30;
		this.repopulationRate = 5;
		this.difficultyRate = 0.2;
		this.bgColor = 'white';
		this.dropShadowColor = 'red';
		this._counter = 0;
		this.level = 1;
	};

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.addShip = function() {
		this.ship = new global.Ship([this.WIDTH / 2, this.HEIGHT / 2]);
	};

	Game.prototype.addReadout = function() {
		var options = {
			'ship': this.ship
		}

		this.readout = new global.Readout(options)
	}

	Game.prototype.fire = function() {
		this.bullets.push(this.ship.fire());
	}

	Game.prototype.draw = function() {
		var game = this;

		// clear the canvas
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		// asteroids
		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})

		// bullets
		this.bullets.forEach(function(bullet){
			bullet.draw(game.ctx);
		})

		// ship
		this.ship.draw(this.ctx);

		// text
		this.readout.draw(this.ctx);
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

	Game.prototype.levelUp = function() {
		this.level += 1;
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

	Game.prototype.asteroidCollisionPairs = function() {
		var collisions = [];

		for (var i = 0; i < this.asteroids.length; i++) {
			for (var j = i + 1; j < this.asteroids.length; j++) {
				if ( this.asteroids[i].isCollidedWith(this.asteroids[j]) ) {
					collisions.push([this.asteroids[i], this.asteroids[j]]);
				}
			}
		}

		return collisions
	};

	Game.prototype.asteroidCollisions = function() {
		return this.asteroidCollisionPairs().uniq
	};

	Game.prototype.hitAsteroids = function() {
		var game = this;
		var asteroids = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWithAsteroid(asteroid)) {
					asteroids.push(asteroid);
				}
			})
		})

		return asteroids;
	};

	Game.prototype.collidedBullets = function() {
		var game = this;
		var bullets = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWithAsteroid(asteroid)) {
					bullets.push(bullet);
				}
			})
		})

		return bullets;
	};

	// Game.prototype.explodeAsteroidsIfCollided = function() {
	// 	var game = this;
	// 	this.asteroidCollisions().forEach(function(asteroid){
	// 		if (game.noExplodeAsteroids.indexOf(asteroid) === -1)
	// 		game.explodeAsteroid(asteroid);
	// 	})
	// };

	// Game.prototype.damageAsteroidsIfCollided = function() {
	// 	var game = this;

	// 	this.asteroidCollisionPairs().forEach(function(asteroidPair){
	// 		if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
	// 			game.damageAsteroid(asteroidPair[0], asteroidPair[1].radius);
	// 		}
	// 	})
	// };

	Game.prototype.depopulateNoExplodeAsteroids = function() {
		var game = this;

		this.noExplodeAsteroids.forEach(function(as1){
			var alone = game.noExplodeAsteroids.every(function(as2){
				if (as1 === as2) {
					return true
				}

				return !as1.isCollidedWith(as2);
			})

			if (alone) {
				game.noExplodeAsteroids.remove(as1);
			}
		})
	};

	Game.prototype.explodeAsteroid = function(asteroid) {
		this.asteroids.remove(asteroid);
		var newAsteroids = asteroid.explode();
		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);
	};

	Game.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	Game.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	}

	// Game.prototype.damageShipIfHit = function() {
	// 	var game = this;

	// 	this.asteroids.forEach(function(as){
	// 		if (game.ship.isCollidedWith(as)) {
	// 			game.explodeAsteroid(as);
	// 			global.Visuals.Hit(game.canvas);
	// 			game.ship.health -= as.radius;
	// 		}
	// 	})
	// };

	Game.prototype.repopulateAsteroids = function() {
			this.addAsteroids(1);
	};

	Game.prototype.modifyDifficulty = function() {
			this.changeAsteroidSpeed(this.difficultyRate);
	};

	Game.prototype.changeAsteroidSpeed = function (amnt) {
		Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	};

	Game.prototype.handleCollidingAsteroids = function (as1, as2) {
		this.damageAsteroid(as1, as2.radius);
		this.damageAsteroid(as2, as1.radius);
	};

	Game.prototype.handleCollidedShip = function (asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.Hit(game.canvas);
		game.ship.health -= as.radius;
	};

	Game.prototype.handleBulletHits = function (bullet) {
		this.removeBullet(bullet);
	};

	Game.prototype.handleHitAsteroid = function (asteroid) {
		this.damageAsteroid(asteroid, this.ship.damage);
	};

	Game.prototype.detectCollidingAsteroids = function() {
		var game = this;

		this.asteroidCollisionPairs().forEach(function(asteroidPair){
			if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
				game.handleCollidingAsteroids(asteroidPair[0], asteroidPair[1]);
			}
		})
	};

	Game.prototype.detectHitAsteroids = function() {
		var game = this;

		this.hitAsteroids().forEach(function(asteroid){
			game.handleHitAsteroid(asteroid);
		})
	};

	Game.prototype.detectHitShip = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ship.isCollidedWith(as)) {
				game.handleCollidedShip(as);
			}
		})
	};

	Game.prototype.detectBulletHits = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.removeBullet(bullet);
			game.handleBulletHits(bullet);
		})
	};

	Game.prototype.detectDestroyedObjects = function() {
		var game = this;

		this.asteroids.forEach(function(asteroid){
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});
	};

	Game.prototype.detect = function() {
		this.detectCollidingAsteroids();
		this.detectHitAsteroids();
		this.detectHitShip();
		this.detectBulletHits();
		this.detectDestroyedObjects();
	};

	Game.prototype.counterActions = function() {
		this._counter += 1;

		if (this._counter % (this.FPS * this.repopulationRate) == 0) {
			this.levelUp();
			this.repopulateAsteroids();
			this.modifyDifficulty();
		}
	};

	Game.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.counterActions();
		this.clearOOBBullets();
		this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
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
		this.addReadout();
		new global.Listener(this);
		this.start();
		document.getElementsByTagName('body')[0].bgColor = this.bgColor;
	};

	// for development
	Game.prototype.setUp = function() {
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.addAsteroids(1);
		this.asteroids[0].vel = [0,0];
		this.ship.pos = [100,100];
		this.asteroids[0].pos = [250,250];
	};

})(Asteroids);