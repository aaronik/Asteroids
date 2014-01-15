var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var GlobalGame = global.GlobalGame = function() {
		this.ships = [];
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.blackHoles = [];
		this.FPS = 30;
		this.repopulationRate = 30;
		this.difficultyRate = 0.6;
		this.level = 1;
		this._counter = 0;
	}

	GlobalGame.prototype.clearOOBAsteroids = function() { // substituted for wrap around
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

	GlobalGame.prototype.clearOOBBullets = function() {
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

	GlobalGame.prototype.movingObjects = function() {
		return []
			.concat(this.asteroids)
				.concat(this.ships)
					.concat(this.blackHoles);
	}

	GlobalGame.prototype.wrapMovingObjects = function (movingObjects) {
		var game = this;

		if (!movingObjects) {
			var movingObjects = this.movingObjects();
		}

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

	GlobalGame.prototype.asteroidCollisionPairs = function() {
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

	GlobalGame.prototype.asteroidCollisions = function() {
		return this.asteroidCollisionPairs().uniq
	};

	GlobalGame.prototype.asteroidBulletCollisions = function() {
		var game = this;
		var collisions = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWith(asteroid)) {
					collisions.push([asteroid, bullet]);
				}
			})
		})

		return collisions;
	};

	GlobalGame.prototype.depopulateNoExplodeAsteroids = function() {
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

	GlobalGame.prototype.collidedBullets = function() {
		var game = this;
		var bullets = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWith(asteroid)) {
					bullets.push(bullet);
				}
			})
		})

		return bullets;
	};

	GlobalGame.prototype.collidedBullets = function() {
		var game = this;
		var bullets = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWith(asteroid)) {
					bullets.push(bullet);
				}
			})
		})

		return bullets;
	};

	GlobalGame.prototype.repopulateAsteroids = function() {
			this.addAsteroids(5);
	};

	GlobalGame.prototype.modifyDifficulty = function() {
			this.changeAsteroidSpeed(this.difficultyRate);
	};

	GlobalGame.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	GlobalGame.prototype.changeAsteroidSpeed = function (amnt) {
		Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	};

	GlobalGame.prototype.handleCollidingAsteroids = function (as1, as2) {
		this.damageAsteroid(as1, as2.radius);
		this.damageAsteroid(as2, as1.radius);
	};

	GlobalGame.prototype.handleAsteroidBulletCollisions = function (as, bullet) {
		this.damageAsteroid(as, bullet.damage);
		this.removeBullet(bullet);
	}

	GlobalGame.prototype.detectCollidingAsteroids = function() {
		var game = this;

		this.asteroidCollisionPairs().forEach(function(asteroidPair){
			if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
				game.handleCollidingAsteroids(asteroidPair[0], asteroidPair[1]);
			}
		})
	};

	GlobalGame.prototype.detectCollidedShip = function() {
		for (var i = 0; i < this.ships.length; i++) {
			for (var j = 0; j < this.asteroids.length; j++) {
				ship = this.ships[i]; as = this.asteroids[j];

				if (ship.isCollidedWith(as)) {
					this.handleCollidedShip(ship, as);
				}
			}
		}
	};

	GlobalGame.prototype.detectHitAsteroids = function() {
		var game = this;

		this.hitAsteroids().forEach(function(asteroid){
			game.handleHitAsteroid(asteroid);
		})
	};

	GlobalGame.prototype.detectAsteroidBulletCollisions = function() {
		var game = this;

		this.asteroidBulletCollisions().forEach(function(col){
			game.handleAsteroidBulletCollisions(col[0], col[1]);
		})
	};

	GlobalGame.prototype.detectBulletHits = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.handleBulletHits(bullet);
		})
	};

	GlobalGame.prototype.detectLevelChangeReady = function() {
		if (this.asteroids.length == 0) {
			this.levelUp();
		}
	};

	GlobalGame.prototype.get = function (objID) {
		var objects = this.asteroids.concat(this.bullets).concat(this.ships);
		var matchingObj;

		objects.forEach(function (obj) {
			if (obj.id === objID) {
				matchingObj = obj;
				return
			}
		})

		return matchingObj;
	}

	GlobalGame.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];
	};

	GlobalGame.prototype.start = function() {
		var that = this;
		this['mainTimer'] = setInterval(function () {
			that.step();
		}, that.FPS);
	};

})(Asteroids)