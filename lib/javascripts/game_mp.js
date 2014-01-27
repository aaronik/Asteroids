var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var GameMP = global.GameMP = function(canvasEl) {
		this.sendStateRate = 3;

		global.ClientGame.call(this, canvasEl);
		
		//this.socket assigned in init.js;
		//this.shipID assigned in addShip;
	};

	Store.inherits(GameMP, global.ClientGame);

	// The game will never request asteroids, just get them from the server.
	GameMP.prototype.addAsteroid = function (asteroidOpts) {
		this.asteroids.push(new global.Asteroid(asteroidOpts));
	};

	// Add ship, send info to server
	GameMP.prototype.addShip = function() {
		var ship = new global.Ship({pos: [this.WIDTH / 2, this.HEIGHT / 2]});
		this.shipID = ship.id;
		this.ships.push(ship);

		var shipOpts = ship.getState();

		this.socket.emit('addShip', shipOpts);
	};

	GameMP.prototype.addForeignShip = function (shipOpts) {
		this.ships.push(new global.Ship(shipOpts));

		this.addReadout();
	};

	GameMP.prototype.foreignAddBlackHole = function (bhOpts) {
		this.addBlackHole(bhOpts);
	};

	GameMP.prototype.foreignGrowBlackHole = function (amtOpts) {
		var blackHole = this.get(amtOpts.id);
		console.log('growing the following black hole')
		console.log(blackHole)
		var amt = amtOpts.amt;
		this.growBlackHole(blackHole, amt)
	}

	GameMP.prototype.fireForeignShip = function (bulletOpts) {
		var ship = this.get(bulletOpts.shipID);
		var bullet = ship.fire(bulletOpts);
		this.bullets.push(bullet);
	};

	GameMP.prototype.fireShip = function (ship) {
		var bullet = ship.fire();
		this.bullets.push(bullet);

		var bulletOpts = bullet.getState();

		this.socket.emit('fireShip', bulletOpts)
	}

	GameMP.prototype.powerShip = function (ship) {
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));

		this.socket.emit('powerShip', { shipID: ship.id })
	};

	GameMP.prototype.powerForeignShip = function (shipID) {
		var ship = this.get(shipID);
		ship.power();
		this.exhaustParticles = this.exhaustParticles.concat(ship.releaseExhaust(2));
	}

	GameMP.prototype.turnShip = function (ship, dir, percentage) {
		ship.turn(dir, percentage);

		var opts = {
			shipID: ship.id,
			dir: dir,
			percentage: percentage
		}

		this.socket.emit('turnShip', opts);
	};

	GameMP.prototype.turnForeignShip = function (turnOpts) {
		var ship = this.get(turnOpts.shipID);
		var dir = turnOpts.dir;
		var percentage = turnOpts.percentage;

		ship.turn(dir, percentage);
	}

	GameMP.prototype.dampenShip = function (ship) {
		ship.dampen();

		var opts = {
			shipID: ship.id
		}

		socket.emit('dampenShip', opts);
	}

	GameMP.prototype.dampenForeignShip = function (dampenOpts) {
		var ship = this.get(dampenOpts.shipID);

		ship.dampen();
	}

	GameMP.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	GameMP.prototype.foreignRemoveBullet = function (bulletOpts) {
		var id = bulletOpts.id;
		var bullet = this.get(id);
		this.removeBullet(bullet);
	}

	GameMP.prototype.foreignHitShip = function (opts) {
		var ship = this.get(opts.shipID);
		var damage = opts.damage;

		ship.health -= damage;
	}

	GameMP.prototype.foreignDestroyedShip = function (shipIDOpt) {
		var ship = this.get(shipIDOpt.id);

		if (this.shipID === ship.id) {
			this.lost();
		} else {
			this.ships.remove(ship);
			this.announce('+ 40!!');
			this.ships[0].health += 40;
		}
	}

	GameMP.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		this.blackHoles = [];

		// this.repopulateAsteroids();
		// this.modifyDifficulty();
	};

	GameMP.prototype.explodeAsteroid = function(asteroid) {
		this.asteroids.remove(asteroid);
		// var newAsteroids = asteroid.explode();
		// this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		// this.asteroids = this.asteroids.concat(newAsteroids);
	};

	GameMP.prototype.handleCollidedShip = function (ship, asteroid) {
		// game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	GameMP.prototype.handleBulletHits = function (bullet) {
		this.removeBullet(bullet);
	};

	GameMP.prototype.detectCollidedShip = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ships[0].isCollidedWith(as)) {
				game.handleCollidedShip(game.ships[0], as);
			}
		})
	};

	GameMP.prototype.detectDestroyedObjects = function() {
		var game = this;

		// this.asteroids.forEach(function(asteroid){
		// 	if (asteroid.health <= 0) {
		// 		game.explodeAsteroid(asteroid);
		// 	}
		// });

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			if (this.exhaustParticles[i].health <= 0) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	GameMP.prototype.detectSendState = function() {
		if (this._counter % this.sendStateRate == 0) this.sendState();
	}

	GameMP.prototype.detect = function() {
		// this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectCollidedShip();
		this.detectBulletHits();
		this.detectDestroyedObjects();
		this.detectExplodedTexts();
		this.detectSendState();
		this.detectStarBlackHoleCollisions();
		// this.detectLevelChangeReady();
		this.detectExhaustParticleBlackHoleCollisions();
	};

	GameMP.prototype.sendState = function() {
		var shipState = this.ships[0].getState();

		this.socket.emit('shipState', shipState);
	};

	GameMP.prototype.clearState = function() {
		this.asteroids = [];
		// this.bullets = [];
		this.ships = [this.ships[0]];
		this.blackHoles = [];
	};

	GameMP.prototype.handleFullState = function (fullStateObject) {
		var game = this;
		var fullStateArray = fullStateObject.fullStateArray;

		this.clearState();

		fullStateArray.forEach(function (stateObj) {
			switch (stateObj.type) {
				case 'asteroid':
					game.handleFullStateAsteroid(stateObj);
					break;
				case 'blackHole':
					game.handleFullStateBlackHole(stateObj);
					break;
				case 'bullet':
					game.handleFullStateBullet(stateObj);
					break;
				case 'ship':
					game.handleFullStateShip(stateObj);
					break;
				case 'level':
					game.handleFullStateLevel(stateObj);
					break;
			}
		})
	}

	GameMP.prototype.handleFullStateAsteroid = function (stateObj) {
		this.asteroids.push(new global.Asteroid(stateObj));
	}

	GameMP.prototype.handleFullStateBlackHole = function (stateObj) {
		this.blackHoles.push(new global.BlackHole(stateObj));
	}

	GameMP.prototype.handleFullStateBullet = function (stateObj) {
		this.bullets.push(new global.Bullet(null, stateObj));
	}

	GameMP.prototype.handleFullStateShip = function (stateObj) {
		var game = this;

		// our own ship must be updated differently to prevent choppiness
		if (stateObj.id != this.shipID) {
			this.ships.push(new global.Ship(stateObj))
		}

		// make sure all ships stay in same order for better drawing
		var localShip = this.ships.shift();
		var shipIDs = this.ships.map( function (ship) {
			return ship.id
		})

		shipIDs.sort();

		this.ships = shipIDs.map( function (shipID) {
			return game.get(shipID);
		})

		this.ships.unshift(localShip);
	}

	GameMP.prototype.handleFullStateLevel = function (stateObj) {
		this.level = stateObj.level;
	}

	GameMP.prototype.tic = function() {
		this._counter += 1;
	}

	GameMP.prototype.step = function() {
		// this.clearOOBAsteroids();
		this.clearOOBObjects();
		// this.depopulateNoExplodeAsteroids();
		this.wrapMovingObjects();
		this.detect();
		this.draw();
		this.move();
		this.tic();
	};

	GameMP.prototype.pause = function() {
		this.foreignPause();

		socket.emit('pause');
	};

	GameMP.prototype.foreignPause = function() {
		if (this['mainTimer']) {
			this.stop();
			this.announce('Pause', true);
		} else {
			this.start();
			this.announce('Resume')
		}
	}

	GameMP.prototype.initialize = function() {
		// this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.KeyListener(this);
		this.start();
	};

})(Asteroids);