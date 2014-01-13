var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ServerGame = global.ServerGame = function(serverListener, serverResponder, width, height) {
		this.serverListener = serverListener;
		this.serverResponder = serverResponder;
		serverListener.game = this;
		serverResponder.game = this;
		serverListener.initialize();
		this.WIDTH = width;
		this.HEIGHT = height;
		this.ships = [];
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.FPS = 30;
		this.repopulationRate = 30;
		this.difficultyRate = 0.6;
		this.level = 1;
		this._counter = 0;
		this.initialize();
	};

	Store.inherits(ServerGame, global.GlobalGame);

	ServerGame.prototype.addAsteroids = function (numAsteroids) {
		var asteroidOpts;

		for (var i = 0; i < numAsteroids; i++) {
			asteroidOpts = global.Asteroid.randomAsteroidValues(this.WIDTH, this.HEIGHT);
			this.asteroids.push(new global.Asteroid(asteroidOpts));
			this.serverResponder.sendAsteroid(asteroidOpts);
		}
	};

	ServerGame.prototype.addShip = function (shipOpts) {
		this.ships.push(new global.Ship(shipOpts));
	};

	ServerGame.prototype.updateShip = function (shipOpts) {
		var ship = this.get(shipOpts.id);

		this.ships.remove(ship);
		this.ships.push(new global.Ship(shipOpts))
	}

	ServerGame.prototype.removeShip = function (shipID) {
		var ship = this.get(shipID);
		this.ships.remove(ship);
	}

	ServerGame.prototype.fireShip = function (ship, bulletOpts) {
		var ship = ship || this.get(bulletOpts.shipID);
		ship.fire(bulletOpts);
		var bullet = new global.Bullet(ship, bulletOpts);
		this.bullets.push(bullet);
	};

	ServerGame.prototype.powerShip = function (ship) {
		ship.power();
	};

	ServerGame.prototype.turnShip = function (turnOpts) {
		var ship = this.get(turnOpts.shipID);
		var dir = turnOpts.dir;
		var percentage = turnOpts.percentage;
		
		ship.power(dir, percentage);
	};

	ServerGame.prototype.dampenShip = function (dampenOpts) {
		var ship = this.get(dampenOpts.shipID);
		ship.dampen();
	}

	ServerGame.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		});

		this.ships.forEach(function(ship){
			ship.move();
		});

		this.bullets.forEach(function(bullet){
			bullet.move();
		});
	};

	ServerGame.prototype.levelUp = function() {
		this.level += 1;

		this.repopulateAsteroids();
		this.modifyDifficulty();

		this.serverResponder.levelUp();
	};

	ServerGame.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
	}

	// ServerGame.prototype.clearOOBAsteroids = function() { // substituted for wrap around
	// 	var posX;
	// 	var posY;
	// 	var as;

	// 	for(var i = 0; i < this.asteroids.length; i++){
	// 		as = this.asteroids[i];

	// 		posX = as.pos[0];
	// 		posY = as.pos[1];


	// 		if ((posX - as.RADIUS > this.WIDTH || posX + as.RADIUS < 0) || 
	// 			(posY - as.RADIUS > this.HEIGHT || posY + as.RADIUS < 0)) {
	// 			this.asteroids.splice(i, 1);
	// 			this.addAsteroids(1);
	// 		}
	// 	}
	// };

	ServerGame.prototype.clearOOBBullets = function() {
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

	ServerGame.prototype.wrapMovingObjects = function() {
		var game = this;

		var movingObjects = [];
		movingObjects = movingObjects.concat(game.asteroids).concat(game.ships);

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

	ServerGame.prototype.asteroidCollisionPairs = function() {
		// when asteroids are collided with eachother

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

	ServerGame.prototype.asteroidCollisions = function() {
		return this.asteroidCollisionPairs().uniq
	};

	ServerGame.prototype.asteroidBulletCollisions = function() {
		var game = this;
		var collisions = [];

		this.bullets.forEach(function(bullet){
			game.asteroids.forEach(function(asteroid){
				if (bullet.isCollidedWithRadialObject(asteroid)) {
					collisions.push([asteroid, bullet]);
				}
			})
		})

		return collisions;
	};

	ServerGame.prototype.depopulateNoExplodeAsteroids = function() {
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

	ServerGame.prototype.explodeAsteroid = function(asteroid) {
		var game = this;

		this.asteroids.remove(asteroid);
		var newAsteroidOpts = asteroid.explode();
		var newAsteroids = newAsteroidOpts.map(function(opts){
			return new global.Asteroid(opts);
		})

		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);

		this.serverResponder.explodeAsteroid({ id: asteroid.id })

		newAsteroidOpts.forEach(function(opts){
			game.serverResponder.sendAsteroid(opts);
		})
	};

	ServerGame.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	ServerGame.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);

		var opts = {
			id: bullet.id
		}

		this.serverResponder.removeBullet(opts);
	};

	ServerGame.prototype.repopulateAsteroids = function() {
			this.addAsteroids(5);
	};

	ServerGame.prototype.modifyDifficulty = function() {
			this.changeAsteroidSpeed(this.difficultyRate);
	};

	ServerGame.prototype.changeAsteroidSpeed = function (amnt) {
		Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	};

	ServerGame.prototype.handleCollidingAsteroids = function (as1, as2) {
		this.damageAsteroid(as1, as2.radius);
		this.damageAsteroid(as2, as1.radius);
	};

	ServerGame.prototype.handleCollidedShip = function (ship, asteroid) {
		this.explodeAsteroid(asteroid);
		// global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	ServerGame.prototype.handleHitShip = function (ship, bullet) {
		ship.health -= bullet.damage;
		this.removeBullet(bullet);

		var opts = {
			shipID: ship.id,
			damage: bullet.damage
		}

		this.serverResponder.hitShip(opts)
	}

	ServerGame.prototype.handleAsteroidBulletCollisions = function (as, bullet) {
		this.damageAsteroid(as, bullet.damage);
		this.removeBullet(bullet);
	}

	ServerGame.prototype.handleDestroyedShip = function (ship) {
		this.ships.remove(ship);

		this.serverResponder.handleDestroyedShip({ id: ship.id })
	}

	ServerGame.prototype.detectCollidingAsteroids = function() {
		var game = this;

		this.asteroidCollisionPairs().forEach(function(asteroidPair){
			if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
				game.handleCollidingAsteroids(asteroidPair[0], asteroidPair[1]);
			}
		})
	};

	ServerGame.prototype.detectHitAsteroids = function() {
		var game = this;

		this.hitAsteroids().forEach(function(asteroid){
			game.handleHitAsteroid(asteroid);
		})
	};

	ServerGame.prototype.detectCollidedShip = function() {
		var game = this;
		var ship;
		var as;

		for (var i = 0; i < this.ships.length; i++) {
			for (var j = 0; j < this.asteroids.length; j++) {
				ship = this.ships[i]; as = this.asteroids[j];

				if (ship.isCollidedWith(as)) {
					game.handleCollidedShip(ship, as);
				}
			}
		}
	};

	ServerGame.prototype.detectHitShip = function() {
		var ship;
		var bullet;

		for (var i = 0; i < this.bullets.length; i++) {
			for (var j = 0; j < this.ships.length; j++) {
				bullet = this.bullets[i];
				ship = this.ships[j];

				if (bullet.isCollidedWithRadialObject(ship) && bullet.ship.id != ship.id) {
					this.handleHitShip(ship, bullet);
					return
				}
			}
		}
	}

	ServerGame.prototype.detectAsteroidBulletCollisions = function() {
		var game = this;

		this.asteroidBulletCollisions().forEach(function(col){
			game.handleAsteroidBulletCollisions(col[0], col[1]);
		})
	};

	// ServerGame.prototype.detectBulletHits = function() {
	// 	var game = this;

	// 	this.collidedBullets().forEach(function(bullet){
	// 		game.removeBullet(bullet);
	// 		game.handleBulletHits(bullet);
	// 	})
	// };

	ServerGame.prototype.detectDestroyedAsteroids = function() {
		var game = this;

		this.asteroids.forEach(function (asteroid) {
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});
	};

	ServerGame.prototype.detectDestroyedShips = function() {
		var game = this;

		this.ships.forEach(function (ship) {
			if (ship.health <= 0) {
				game.handleDestroyedShip(ship);
			}
		})
	}

	ServerGame.prototype.detectLevelChangeReady = function() {
		if (this.asteroids.length == 0) {
			this.levelUp();
		}
	};

	ServerGame.prototype.detectSendFullState = function() {
		if (this._counter % 30 == 0) this.sendFullState();
	}

	ServerGame.prototype.detect = function() {
		this.detectCollidingAsteroids();
		this.detectAsteroidBulletCollisions();
		this.detectCollidedShip();
		this.detectDestroyedAsteroids();
		this.detectDestroyedShips();
		// this.detectExplodedTexts();
		this.detectLevelChangeReady();
		this.detectSendFullState();
		this.detectHitShip();
	};

	ServerGame.prototype.sendFullState = function() {
		this.serverResponder.sendFullState();
	}

	ServerGame.prototype.tic = function() {
		this._counter += 1;
	}

	ServerGame.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		// this.draw();
		this.move();
		this.tic();
	};

	ServerGame.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
		} else {
			this.start();
		}
	};

	ServerGame.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];
	};

	ServerGame.prototype.start = function() {
		var that = this;
		this['mainTimer'] = setInterval(function () {
			that.step();
		}, that.FPS);
	};

	ServerGame.prototype.initialize = function() {
		this.addAsteroids(5);
		// this.addShip();
		// this.addReadout();
		// this.addBackground();
		// new global.Listener(this);
		this.start();
	};

	ServerGame.prototype.get = function (objID) {
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

	ServerGame.prototype.getFullState = function() {
		var objs = this.asteroids.concat(this.ships)//.concat(this.bullets)
		var states = objs.map(function (obj) {
			return obj.getState();
		})

		var levelObj = {
			type: 'level',
			level: this.level
		}

		states.push(levelObj)

		return states;
	}

})(Asteroids);