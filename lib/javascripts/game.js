var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Game = global.Game = function(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.exhaustParticles = [];
		this.explodingTexts = [];
		this.ships = [];
		this.FPS = 30;
		this.repopulationRate = 30;
		this.difficultyRate = 0.6;
		this.dropShadowColor = 'red';
		this.level = 1;
		this.status = 'n/a';
		this.gameID = 'n/a'
		this.initialize();
	};

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.addShip = function() {
		this.ships.push(new global.Ship({pos: [this.WIDTH / 2, this.HEIGHT / 2]}));
	};

	Game.prototype.addReadout = function() {
		var options = {
			'game': this
		}

		this.readout = new global.Readout(options)
	};

	Game.prototype.addBackground = function() {
		this.background = new global.Background(this);
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

	Game.prototype.draw = function() {
		var game = this;

		// clear the canvas
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		// background
		this.background.draw(this.ctx);

		// ship exhaust particles
		this.exhaustParticles.forEach(function(ep){
			ep.draw(game.ctx);
		})

		// bullets
		this.bullets.forEach(function(bullet){
			bullet.draw(game.ctx);
		})

		// asteroids
		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})

		// ship
		this.ships.forEach(function(ship){
			ship.draw(game.ctx);
		})

		// readout text
		this.readout.draw(this.ctx);

		// exploding texts
		this.explodingTexts.forEach(function(txt){
			txt.draw(game.ctx);
		})
	};

	Game.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		});

		this.ships.forEach(function(ship){
			ship.move();
		})

		this.bullets.forEach(function(bullet){
			bullet.move();
		});

		this.exhaustParticles.forEach(function(ep){
			ep.move();
		})

		this.background.move();
	};

	Game.prototype.announce = function (txt, independentTimer) {
		var independentTimer = independentTimer || false;

		var explodingTextOptions = {
			'game': this,
			'txt': txt,
			'independentTimer': independentTimer
		}

		this.explodingTexts.push(new global.ExplodingText(explodingTextOptions))
	}

	Game.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.repopulateAsteroids();
		this.modifyDifficulty();
	};

	Game.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		this.clearOOBExhaustParticles();
	}

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

	Game.prototype.clearOOBExhaustParticles = function() {
		var ep;
		var posX;
		var posY;

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			ep = this.exhaustParticles[i];
			posX = ep.pos[0];
			posY = ep.pos[1];

			if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	Game.prototype.wrapMovingObjects = function() {
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

	Game.prototype.asteroidBulletCollisions = function() {
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
		var newAsteroidOpts = asteroid.explode();
		var newAsteroids = newAsteroidOpts.map(function(opts){
			return new global.Asteroid(opts);
		})
		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);
	};

	Game.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	Game.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	Game.prototype.repopulateAsteroids = function() {
			this.addAsteroids(5);
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

	Game.prototype.handleCollidedShip = function (ship, asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	Game.prototype.handleDestroyedShip = function (ship) {
		this.lost();
	}

	Game.prototype.handleAsteroidBulletCollisions = function (as, bullet) {
		this.damageAsteroid(as, bullet.damage);
		this.removeBullet(bullet);
	};

	Game.prototype.handleExplodedText = function (txt) {
		this.explodingTexts.remove(txt);
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

	Game.prototype.detectAsteroidBulletCollisions = function() {
		var game = this;

		this.asteroidBulletCollisions().forEach(function(col){
			game.handleAsteroidBulletCollisions(col[0], col[1]);
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

	Game.prototype.detectExplodedTexts = function() {
		var game = this;

		this.explodingTexts.forEach(function(txt){
			if (txt.alpha <= 0) {
				game.handleExplodedText(txt);
			}
		})
	};

	Game.prototype.detectLevelChangeReady = function() {
		if (this.asteroids.length == 0) {
			this.levelUp();
		}
	};

	Game.prototype.detect = function() {
		this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectAsteroidBulletCollisions();
		this.detectHitShip();
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

	Game.prototype.lost = function() {
		this.stop();
		this.announce('You\'ve lost.', true);
		this.pause = null;
		global.Visuals.restartScreen();
	}

	Game.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.KeyListener(this);
		this.start();
		this.announce('Welcome!');
	};

	// for development
	Game.prototype.setUp = function() {
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.addAsteroids(1);
		this.asteroids[0].vel = [0,0];
		this.ships[0].pos = [100,100];
		this.asteroids[0].pos = [250,250];
	};

})(Asteroids);