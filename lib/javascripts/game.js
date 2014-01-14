var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Game = global.Game = function(canvasEl) {
		this.status = 'n/a';
		this.gameID = 'n/a'

		global.ClientGame.call(this, canvasEl);

		this.initialize();
	};

	Store.inherits(Game, global.ClientGame);

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.addShip = function() {
		this.ships.push(new global.Ship({pos: [this.WIDTH / 2, this.HEIGHT / 2]}));
	};

	Game.prototype.fireShip = function (ship) {
		this.bullets.push(ship.fire());
	};

	Game.prototype.powerShip = function (ship) {
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));
	};

	Game.prototype.turnShip = function (ship, dir, percentage) {
		ship.turn(dir, percentage);
	};

	Game.prototype.dampenShip = function (ship) {
		ship.dampen();
	}

	Game.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.repopulateAsteroids();
		this.modifyDifficulty();
	};

	Game.prototype.explodeAsteroid = function(asteroid) {
		this.asteroids.remove(asteroid);
		var newAsteroidOpts = asteroid.explode();
		var newAsteroids = newAsteroidOpts.map(function(opts){
			return new global.Asteroid(opts);
		})
		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);
	};

	Game.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	Game.prototype.handleCollidedShip = function (ship, asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	Game.prototype.handleDestroyedShip = function (ship) {
		this.lost();
	}

	Game.prototype.detectCollidedShip = function() {
		var game = this;
		var ship;
		var as;

		for (var i = 0; i < this.ships.length; i++) {
			for (var j = 0; j < this.asteroids.length; j++) {
				ship = this.ships[i];
				as = this.asteroids[j];

				if (ship.isCollidedWith(as)) {
					game.handleCollidedShip(ship, as);
				}
			}
		}
	};

	Game.prototype.detectDestroyedShips = function() {
		var game = this;

		this.ships.forEach(function (ship) {
			if (ship.health <= 0) {
				game.handleDestroyedShip(ship);
			}
		})
	}

	Game.prototype.detectDestroyedObjects = function() {
		var game = this;

		this.asteroids.forEach(function (asteroid) {
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			if (this.exhaustParticles[i].health <= 0) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	Game.prototype.detect = function() {
		this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectAsteroidBulletCollisions();
		this.detectCollidedShip();
		this.detectDestroyedShips();
		// this.detectBulletHits();
		this.detectDestroyedObjects();
		this.detectExplodedTexts();
		this.detectLevelChangeReady();
	};

	Game.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		this.draw();
		this.move();
	};

	Game.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
			this.announce('Pause', true);
		} else {
			this.start();
			this.announce('Resume')
		}
	};

	Game.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.KeyListener(this);
		this.start();
		this.announce('Welcome!');
	};

})(Asteroids);