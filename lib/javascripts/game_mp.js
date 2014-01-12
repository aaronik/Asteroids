var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var GameMP = global.GameMP = function(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.ships = [];
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.exhaustParticles = [];
		this.explodingTexts = [];
		this.FPS = 30;
		this.repopulationRate = 30;
		this.difficultyRate = 0.6;
		this.bgColor = 'white';
		this.dropShadowColor = 'red';
		this.level = 1;
		this._counter = 0;
		this.sendStateRate = 3;
		//this.socket assigned in init.js;
		//this.shipID assigned in addShip;
	};

	// The game will never request asteroids, just get them from the server.
	GameMP.prototype.addAsteroid = function (asteroidOpts) {
		this.asteroids.push(new global.Asteroid(asteroidOpts));
	};

	// Add ship, send info to server
	GameMP.prototype.addShip = function() {
		var ship = new global.Ship({pos: [this.WIDTH / 2, this.HEIGHT / 2]});
		this.shipID = ship.id;
		this.ships.push(ship);

		var opts = {
			id: ship.id,
			pos: ship.pos,
			vel: ship.vel,
			orientation: ship.orientation,
			rotateSpeed: ship.rotateSpeed,
			impulse: ship.impulse,
			dampenRate: ship.dampenRate,
			fireFrequency: ship.fireFrequency,
			health: ship.health,
			damage: ship.damage,
			kineticBullets: ship.kineticBullets,
			bulletWeight: ship.bulletWeight
		}

		this.socket.emit('addShip', opts);
	};

	GameMP.prototype.addForeignShip = function (shipOpts) {
		this.ships.push(new global.Ship(shipOpts));

		this.addReadout();
	};

	GameMP.prototype.addReadout = function() {
		var options = {
			'game': this
		}

		this.readout = new global.Readout(options)
	};

	GameMP.prototype.addBackground = function() {
		this.background = new global.Background(this);
	};

	GameMP.prototype.fireForeignShip = function (shipID) {
		var ship = this.get(shipID);
		var bullet = ship.fire();
		this.bullets.push(bullet);
	};

	GameMP.prototype.fireShip = function (ship) {
		var bullet = ship.fire();
		this.bullets.push(bullet);

		var opts = {
			pos: bullet.pos,
			vel: bullet.vel,
			orientation: bullet.orientation,
			shipID: ship.id
		}

		this.socket.emit('createBullet', opts)
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

	GameMP.prototype.draw = function() {
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

	GameMP.prototype.move = function() {
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

	GameMP.prototype.announce = function (txt, independentTimer) {
		var independentTimer = independentTimer || false;

		var explodingTextOptions = {
			'game': this,
			'txt': txt,
			'independentTimer': independentTimer
		}

		this.explodingTexts.push(new global.ExplodingText(explodingTextOptions))
	}

	GameMP.prototype.levelUp = function() {
		this.level += 1;
		this.announce('Level ' + this.level);

		// this.repopulateAsteroids();
		// this.modifyDifficulty();
	};

	GameMP.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		this.clearOOBExhaustParticles();
	}

	// GameMP.prototype.clearOOBAsteroids = function() { // substituted for wrap around
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

	GameMP.prototype.clearOOBBullets = function() {
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

	GameMP.prototype.clearOOBExhaustParticles = function() {
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

	GameMP.prototype.wrapMovingObjects = function() {
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

	// GameMP.prototype.asteroidCollisionPairs = function() {
	// 	var collisions = [];

	// 	for (var i = 0; i < this.asteroids.length; i++) {
	// 		for (var j = i + 1; j < this.asteroids.length; j++) {
	// 			if ( this.asteroids[i].isCollidedWith(this.asteroids[j]) ) {
	// 				collisions.push([this.asteroids[i], this.asteroids[j]]);
	// 			}
	// 		}
	// 	}

	// 	return collisions
	// };

	// GameMP.prototype.asteroidCollisions = function() {
	// 	return this.asteroidCollisionPairs().uniq
	// };

	GameMP.prototype.hitAsteroids = function() {
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

	GameMP.prototype.collidedBullets = function() {
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

	// GameMP.prototype.depopulateNoExplodeAsteroids = function() {
	// 	var game = this;

	// 	this.noExplodeAsteroids.forEach(function(as1){
	// 		var alone = game.noExplodeAsteroids.every(function(as2){
	// 			if (as1 === as2) {
	// 				return true
	// 			}

	// 			return !as1.isCollidedWith(as2);
	// 		})

	// 		if (alone) {
	// 			game.noExplodeAsteroids.remove(as1);
	// 		}
	// 	})
	// };

	GameMP.prototype.explodeAsteroid = function(asteroid) {
		this.asteroids.remove(asteroid);
		// var newAsteroids = asteroid.explode();
		// this.noExplodeAsteroids = this.noExplodeAsteroids.concat(newAsteroids);
		// this.asteroids = this.asteroids.concat(newAsteroids);
	};

	GameMP.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	GameMP.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	};

	GameMP.prototype.foreignRemoveBullet = function (bulletOpts) {
		var id = bulletOpts.id;
		var bullet = this.get(id);
		this.bullets.remove(bullet);
	}

	// GameMP.prototype.repopulateAsteroids = function() {
	// 		this.addAsteroids(5);
	// };

	// GameMP.prototype.modifyDifficulty = function() {
	// 		this.changeAsteroidSpeed(this.difficultyRate);
	// };

	// GameMP.prototype.changeAsteroidSpeed = function (amnt) {
	// 	Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	// };

	GameMP.prototype.handleCollidingAsteroids = function (as1, as2) {
		this.damageAsteroid(as1, as2.radius);
		this.damageAsteroid(as2, as1.radius);
	};

	GameMP.prototype.handleCollidedShip = function (ship, asteroid) {
		// game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		ship.health -= asteroid.radius;
	};

	GameMP.prototype.handleBulletHits = function (bullet) {
		this.removeBullet(bullet);
	};

	// GameMP.prototype.handleHitAsteroid = function (asteroid) {
	// 	this.damageAsteroid(asteroid, this.ships[0].damage);
	// };

	GameMP.prototype.handleExplodedText = function (txt) {
		this.explodingTexts.remove(txt);
	};

	// GameMP.prototype.detectCollidingAsteroids = function() {
	// 	var game = this;

	// 	this.asteroidCollisionPairs().forEach(function(asteroidPair){
	// 		if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
	// 			game.handleCollidingAsteroids(asteroidPair[0], asteroidPair[1]);
	// 		}
	// 	})
	// };

	// GameMP.prototype.detectHitAsteroids = function() {
	// 	var game = this;

	// 	this.hitAsteroids().forEach(function(asteroid){
	// 		game.handleHitAsteroid(asteroid);
	// 	})
	// };

	GameMP.prototype.detectHitShip = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ships[0].isCollidedWith(as)) {
				game.handleCollidedShip(game.ships[0], as);
			}
		})
	};

	GameMP.prototype.detectBulletHits = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.handleBulletHits(bullet);
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

	GameMP.prototype.detectExplodedTexts = function() {
		var game = this;

		this.explodingTexts.forEach(function(txt){
			if (txt.alpha <= 0) {
				game.handleExplodedText(txt);
			}
		})
	};

	// GameMP.prototype.detectLevelChangeReady = function() {
	// 	if (this.asteroids.length == 0) {
	// 		this.levelUp();
	// 	}
	// };

	GameMP.prototype.detectSendState = function() {
		if (this._counter % this.sendStateRate == 0) this.sendState();
	}

	GameMP.prototype.detect = function() {
		// this.detectCollidingAsteroids();
		// this.detectHitAsteroids();
		this.detectHitShip();
		this.detectBulletHits();
		this.detectDestroyedObjects();
		this.detectExplodedTexts();
		this.detectSendState();
		// this.detectLevelChangeReady();
	};

	GameMP.prototype.sendState = function() {
		var shipState = this.ships[0].getState();

		this.socket.emit('shipState', shipState);
	}

	GameMP.prototype.get = function (objID) {
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

	GameMP.prototype.clearState = function() {
		this.asteroids = [];
		// this.bullets = [];
		this.ships = [this.ships[0]];
	}

	GameMP.prototype.handleFullState = function (fullStateObject) {
		var game = this;
		var fullStateArray = fullStateObject.fullStateArray;

		this.clearState();

		fullStateArray.forEach(function (stateObj) {
			switch (stateObj.type) {
				case 'asteroid':
					game.handleFullStateAsteroid(stateObj);
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
		this.asteroids.push(new global.Asteroid(stateObj))
	}

	GameMP.prototype.handleFullStateBullet = function (stateObj) {
		this.bullets.push(new global.Bullet(null, stateObj))
	}

	GameMP.prototype.handleFullStateShip = function (stateObj) {
		if (stateObj.id != this.shipID) {
			this.ships.push(new global.Ship(stateObj))
		}
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

	GameMP.prototype.stop = function() {
		clearInterval(this['mainTimer']);
		delete this['mainTimer'];

		// will have to send a stop event to the server
		// socket.emit('stop');
	};

	GameMP.prototype.start = function() {
		var that = this;
		this['mainTimer'] = window.setInterval(function () {
			that.step();
		}, that.FPS);

		// will have to send a start event to the server
		// socket.emit('start');
	};

	GameMP.prototype.initialize = function() {
		// this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.KeyListener(this);
		this.start();
		document.getElementsByTagName('body')[0].bgColor = this.bgColor;
	};

})(Asteroids);