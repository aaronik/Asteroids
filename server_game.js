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

		global.GlobalGame.call(this);
		
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
		console.log(shipOpts)
		console.log('##############')
		this.ships.push(new global.Ship(shipOpts));
		console.log(this.ships)
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
		if (ship) {
			ship.power();
		}
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
		this.movingObjects().forEach(function (object) {
			this.blackHoles.forEach(function (blackHole) {
				object.gravitate(blackHole);
			})

			// object.move();
		})

		this.asteroids.forEach(function (asteroid) {
			asteroid.move();
		});

		this.ships.forEach(function (ship) {
			ship.move();
		});

		this.bullets.forEach(function (bullet) {
			bullet.move();
		});

		this.blackHoles.forEach(function (blackHole) {
			blackHole.move();
		})
	};

	ServerGame.prototype.levelUp = function() {
		this.level += 1;

		this.repopulateAsteroids();
		this.modifyDifficulty();
		this.blackHoles = [];

		this.serverResponder.levelUp();
	};

	ServerGame.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
	}

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

	ServerGame.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);

		var opts = {
			id: bullet.id
		}

		this.serverResponder.removeBullet(opts);
	};

	ServerGame.prototype.handleCollidedShip = function (ship, asteroid) {
		this.explodeAsteroid(asteroid);
		// global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;

		console.log('HANDLECOLLIDEDSHIP HAS BEEN CALLED')

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

	ServerGame.prototype.handleDestroyedShip = function (ship) {
		this.serverResponder.handleDestroyedShip({ id: ship.id })
		console.log('HANDLEDESTROYEDSHIP CALLED')
		console.log('***********************8')
		console.log(this.ships)

		this.ships.remove(ship);
	}

	ServerGame.prototype.detectHitShip = function() {
		var ship;
		var bullet;

		for (var i = 0; i < this.bullets.length; i++) {
			for (var j = 0; j < this.ships.length; j++) {
				bullet = this.bullets[i];
				ship = this.ships[j];

				if (bullet.isCollidedWith(ship) && bullet.ship.id != ship.id) {
					this.handleHitShip(ship, bullet);
					return
				}
			}
		}
	}

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
		this.detectAsteroidBlackHoleCollisions();
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

	ServerGame.prototype.initialize = function() {
		this.addAsteroids(5);
		// this.addShip();
		// this.addReadout();
		// this.addBackground();
		// new global.Listener(this);
		this.start();
	};

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