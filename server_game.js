var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var ServerGame = global.ServerGame = function(ServerListener, ServerResponder, width, height) {
		this.ServerListener = ServerListener;
		this.ServerResponder = ServerResponder;
		ServerListener.game = this;
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
	};

	ServerGame.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	ServerGame.prototype.addShip = function() {
		this.ship = new global.Ship([this.WIDTH / 2, this.HEIGHT / 2]);
	};

	ServerGame.prototype.addReadout = function() {
		var options = {
			'ship': this.ship,
			'game': this
		}

		this.readout = new global.Readout(options)
	};

	ServerGame.prototype.addBackground = function() {
		this.background = new global.Background(this);
	};

	ServerGame.prototype.fireShip = function (ship) {
		this.bullets.push(ship.fire());
	};

	ServerGame.prototype.powerShip = function (ship) {
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));
	};

	ServerGame.prototype.turnShip = function (ship, dir, percentage) {
		ship.turn(dir, percentage);
	};

	ServerGame.prototype.dampenShip = function (ship) {
		ship.dampen();
	}

	ServerGame.prototype.draw = function() {
		var game = this;

		// clear the canvas
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		// background
		this.background.draw(this.ctx);

		// ship exhaust particles
		this.exhaustParticles.forEach(function(ep){
			ep.draw(game.ctx);
		})

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

		// readout text
		this.readout.draw(this.ctx);

		// exploding texts
		this.explodingTexts.forEach(function(txt){
			txt.draw(game.ctx);
		})
	};

	ServerGame.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		});

		this.ship.move();

		this.bullets.forEach(function(bullet){
			bullet.move();
		});

		this.exhaustParticles.forEach(function(ep){
			ep.move();
		})

		this.background.move();
	};

	ServerGame.prototype.announce = function (txt, independentTimer) {
		var independentTimer = independentTimer || false;

		var explodingTextOptions = {
			'game': this,
			'txt': txt,
			'independentTimer': independentTimer
		}

		this.explodingTexts.push(new global.ExplodingText(explodingTextOptions))
	}

	ServerGame.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.repopulateAsteroids();
		this.modifyDifficulty();
	};

	ServerGame.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		this.clearOOBExhaustParticles();
	}

	ServerGame.prototype.clearOOBAsteroids = function() { // substituted for wrap around
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

	ServerGame.prototype.clearOOBExhaustParticles = function() {
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

	ServerGame.prototype.wrapMovingObjects = function() {
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

	ServerGame.prototype.asteroidCollisionPairs = function() {
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
				if (bullet.isCollidedWithAsteroid(asteroid)) {
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
		this.asteroids.remove(asteroid);
		var newAsteroids = asteroid.explode();
		this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		this.asteroids = this.asteroids.concat(newAsteroids);
	};

	ServerGame.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	ServerGame.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
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

	ServerGame.prototype.handleCollidedShip = function (asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		game.ship.health -= asteroid.radius;
	};

	ServerGame.prototype.handleAsteroidBulletCollisions = function (as, bullet) {
		this.damageAsteroid(as, bullet.damage);
		this.removeBullet(bullet);
	};

	ServerGame.prototype.handleExplodedText = function (txt) {
		this.explodingTexts.remove(txt);
	};

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

	ServerGame.prototype.detectHitShip = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ship.isCollidedWith(as)) {
				game.handleCollidedShip(as);
			}
		})
	};

	ServerGame.prototype.detectAsteroidBulletCollisions = function() {
		var game = this;

		this.asteroidBulletCollisions().forEach(function(col){
			game.handleAsteroidBulletCollisions(col[0], col[1]);
		})
	};

	ServerGame.prototype.detectBulletHits = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.removeBullet(bullet);
			game.handleBulletHits(bullet);
		})
	};

	ServerGame.prototype.detectDestroyedObjects = function() {
		var game = this;

		this.asteroids.forEach(function(asteroid){
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});
	};

	ServerGame.prototype.detectExplodedTexts = function() {
		var game = this;

		this.explodingTexts.forEach(function(txt){
			if (txt.alpha <= 0) {
				game.handleExplodedText(txt);
			}
		})
	};

	ServerGame.prototype.detectLevelChangeReady = function() {
		if (this.asteroids.length == 0) {
			this.levelUp();
		}
	};

	ServerGame.prototype.detect = function() {
		this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectAsteroidBulletCollisions();
		this.detectHitShip();
		// this.detectBulletHits();
		this.detectDestroyedObjects();
		this.detectExplodedTexts();
		this.detectLevelChangeReady();
	};

	ServerGame.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		this.draw();
		this.move();
	};

	ServerGame.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
			this.announce('Pause', true);
		} else {
			this.start();
			this.announce('Resume')
		}
	};

	ServerGame.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];
	};

	ServerGame.prototype.start = function() {
		var that = this;
		this['mainTimer'] = window.setInterval(function () {
			that.step();
		}, that.FPS);
	};

	ServerGame.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.Listener(this);
		this.start();
	};

	// for development
	ServerGame.prototype.setUp = function() {
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.addAsteroids(1);
		this.asteroids[0].vel = [0,0];
		this.ship.pos = [100,100];
		this.asteroids[0].pos = [250,250];
	};

})(Asteroids);