(function(A){

  A.sample = (A.sample || function(count) {
    sampleArray = [];
    count = count || 1;

    for(var i = 0; i < count; i++){
      sampleArray.push(this[Math.floor(Math.random() * this.length)])
    }

    if (count == 1) {
      return sampleArray[0];
    } else {
      return sampleArray;
    }
  })

  A.normalize = (A.normalize || function() {
    var mag = this.mag();

    return this.map(function(el){return el / mag});
  });

  A.rotate = (A.rotate || function (rads) {
    if (this.length != 2) {
      return false
    }

    var rotatedArr = [];
    rotatedArr.push(Math.cos(rads)*this[0] + Math.sin(rads)*this[1]);
    rotatedArr.push(Math.cos(rads)*this[1] - Math.sin(rads)*this[0]);

    return rotatedArr;
  });

  A.scale = (A.scale || function (mag) {
    return this.map(function(el){return el * mag});
  });

  A.add = (A.add || function (vector) {
    var result = [];

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(vector[i])
      } else {
        result.push(this[i] + vector[i])
      }
    }

    return result;

    return result;
  });

  A.subtract = (A.subtract || function (vector) {
    var result = [];

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(-vector[i])
      } else {
        result.push(this[i] - vector[i])
      }
    }

    return result;
  });

  A.pow = (A.pow || function (scalar) {
    return this.map(function(el){
      return Math.pow(el, scalar);
    })
  });

  A.mag = (A.mag || function() {
    var squares = this.map(function(el){return el * el});
    var sumOfSquares = squares.reduce(function(sum, el){return sum += el});
    return Math.sqrt(sumOfSquares);
  });

  A.distance = (A.distance || function (vector) {
    if (this.length != vector.length) {
      return false
    }

    var distX = this[0] - vector[0];
    var distY = this[1] - vector[1];

    //dist = sqrt(distX^2 + distY^2)
    return Math.sqrt((distX * distX) + (distY * distY));
  });

  A.remove = (A.remove || function (el) {
    for (var i = 0; i < this.length; i++) {
      if (el === this[i]) {
        this.splice(i, 1);
        return this;
      }
    }

    return false;
  });

  A.uniq = (A.uniq || function() {
    var uniqHash = {};
    var returnArray = [];

    for (var i = 0; i < this.length; i++) {
      if (!uniqHash[this[i]]) {
        uniqHash[this[i]] = true;
        returnArray.push(this[i]);
      }
    }

    return returnArray
  });

  A.nudge = (A.nudge || function() {
    return this.rotate((Math.random() / 8) * [-1, 1].sample());
  });
  
})(Array.prototype);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Store = global.Store = (global.Store || {});

	Store.inherits = function (child, parent) {
		function Surrogate(){};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();
	};

	Store.randomVel = function (radius) {
		var speedX = Math.random() * global.Asteroid.maxSpeed(radius) * [-1, 1].sample();
		var speedY = Math.random() * global.Asteroid.maxSpeed(radius) * [-1, 1].sample();

		return [speedX, speedY];
	};

	Store.randomColor = function() {
		var colorString = "#";

		for (var i = 0; i < 6; i++) {
			colorString += [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'].sample();
		}

		return colorString;
	};

	Store.uid = function() {
		var arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

		var uid = '';

		for (var i = 0; i < 32; i++) {
			uid += arr.sample();
		}

		return uid;
	};

	Store.assignOnclickToNodeList = function (nodeList, callback) {
		for (var i = 0; i < nodeList.length; i++) {
			nodeList[i].onclick = callback;
		}
	};

	// Store.randomRGB = function() {
	// 	// will output a string like '123, 231, 111'
	// 	var string = '';

	// 	string += Math.floor(Math.random() * 256);
	// 	string += ', ';
	// 	string += Math.floor(Math.random() * 256);
	// 	string += ', ';
	// 	string += Math.floor(Math.random() * 256);

	// 	return string;
	// }
})(Asteroids)
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	MovingObject = global.MovingObject = function (pos, vel, radius) {
		this.radius = radius;
		this.pos = pos;
		this.vel = vel;
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0]; 
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.isCollidedWith = function (otherObject) {
		var otherRadius = otherObject.radius;
		var dist = this.pos.distance(otherObject.pos)

		if((otherRadius + this.radius) > dist){
			return true;
		} else {
			return false;
		}
	};

	// a strange function.  Never gets called.
	MovingObject.prototype.start = function (canvas) {
		var game = this;
		var ctx = canvasEl.getContext("2d");

		window.setInterval(function () {
			as1.move();
			as1.draw(ctx);

		}, 100);
	};


})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (pos, vel, rad, color) {
		var color = color || Store.randomColor();
		this.radius = rad;
		this.color = color;
		this.pos = pos;
		this.vel = vel;
		this.health = this.radius;
	};

	Store.inherits(Asteroid, MovingObject);

	Asteroid.MAX_SPEED_MULTIPLIER = 1;
	Asteroid.RADII = [40, 25, 10];

	Asteroid.maxSpeed = function (radius) {
		radius = radius || Asteroid.RADII[0];

		return (Asteroid.MAX_SPEED_MULTIPLIER / 5) * Math.log(radius);
	};

	Asteroid.randomAsteroid = function(dimX, dimY) {
		var radius = Asteroid.RADII[0];
		// could also if ( Math.round(Math.random()) )
		if ( [true, false].sample() ) {
			var posX = Math.random() * dimX;
			var posY = -radius;
		} else {
			var posX = -radius;
			var posY = Math.random() * dimX;
		}

		var vel = Store.randomVel(radius);
		var pos = [posX, posY];

		return new Asteroid(pos, vel, radius);
	};

	Asteroid.prototype.draw = function (ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

		ctx.fill();
	};

	Asteroid.prototype.explode = function() {
		// create three new asteroids of size one smaller at pos

		var rad = Asteroid.RADII[Asteroid.RADII.indexOf(this.radius) + 1];

		if (!rad) {
			return [];
		}

		var newAsteroids = [];

		var vel;
		for (var i = 0; i < 3; i++) {
			var pos = [];
			pos[0] = this.pos[0]// + [1,2,3].sample() * this.radius;
			pos[1] = this.pos[1]// + [1,2,3].sample() * this.radius;

			vel = Store.randomVel(rad);
			newAsteroids.push(new Asteroid(pos, vel, rad));
		}

		return newAsteroids;
	};

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Game = global.Game = function(canvasEl) {
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
		this.initialize();
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
			'ship': this.ship,
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

	Game.prototype.move = function() {
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

	Game.prototype.asteroidBulletCollisions = function() {
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

	Game.prototype.handleCollidedShip = function (asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		game.ship.health -= asteroid.radius;
	};

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

		this.asteroids.forEach(function(as){
			if (game.ship.isCollidedWith(as)) {
				game.handleCollidedShip(as);
			}
		})
	};

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

		this.asteroids.forEach(function(asteroid){
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		});
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

	Game.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.Listener(this);
		this.start();
		this.announce('Welcome!');
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
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Game = global.GameMP = function(canvasEl) {
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
			'ship': this.ship,
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

	Game.prototype.move = function() {
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

	Game.prototype.handleCollidedShip = function (asteroid) {
		game.explodeAsteroid(asteroid);
		global.Visuals.hit(game.canvas);
		game.ship.health -= asteroid.radius;
	};

	Game.prototype.handleBulletHits = function (bullet) {
		this.removeBullet(bullet);
	};

	Game.prototype.handleHitAsteroid = function (asteroid) {
		this.damageAsteroid(asteroid, this.ship.damage);
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
		this.detectHitAsteroids();
		this.detectHitShip();
		this.detectBulletHits();
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

	Game.prototype.initialize = function() {
		this.addAsteroids(5);
		this.addShip();
		this.addReadout();
		this.addBackground();
		new global.Listener(this);
		this.start();
		document.getElementsByTagName('body')[0].bgColor = this.bgColor;
	};

})(Asteroids);
var Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Ship = global.Ship = function (pos) {
		var pos = pos;
		var vel = [0, 0];
		var radius = 20 / 3;
		this.orientation = [0,-1];
		this.rotateSpeed = 0.25;
		this.impulse = 0.4;
		this.dampenRate = 0.95;
		this.fireFrequency = 200;
		this.health = 40;
		this.damage = 15;

		this.kineticBullets = true;
		this.bulletWeight = 0.5;

		global.MovingObject.call(this, pos, vel, radius);
	};

	Store.inherits(Ship, MovingObject);

	Ship.prototype.power = function () {
		this.vel = this.vel.add(this.orientation.scale(this.impulse));
	};

	Ship.prototype.releaseExhaust = function (count) {
		var exhaustParticleOptions = {
			'ship': this
		}

		var particles = [];
		if (!count) { var count = 1 }

		for (var i = 0; i < count; i++) {
			particles.push(new global.ExhaustParticle(exhaustParticleOptions));
		}

		return particles;
	};

	Ship.prototype.turn = function (direction, percentage) {
		if (direction === 'left') {
			var mod = 1;
		} else {
			var mod = -1;
		}

		this.orientation = this.orientation.rotate(mod * this.rotateSpeed * percentage); 
	};

	Ship.prototype.dampen = function () {
		var dampenRate = this.dampenRate;

		if (this.vel.mag() < 3) {
			// this.vel = [0, 0];
			dampenRate = 0.5;
			this.vel = this.vel.scale(dampenRate);
		} else {
			dampenRate = this.dampenRate;
			this.vel = this.vel.scale(dampenRate);
		}
	}

	Ship.prototype.fire = function() {
		this.recoil();
		return new global.Bullet(this);
	}

	Ship.prototype.recoil = function() {
		if (this.kineticBullets) {
			this.vel = this.vel.subtract(this.orientation.scale(this.bulletWeight))
		}
	}

	Ship.prototype.draw = function (ctx) {
		var height = this.radius * 3;
		var base = 0.3;
		var or = this.orientation;

		var start = this.pos;
		var pt1 = start.add(or.scale(height / 1.5));
		var pt2 = pt1.add(or.scale(-height).rotate(base));
		var pt3 = pt1.add(or.scale(-height).rotate(-base));
		var pt4 = pt1;

		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(pt1[0], pt1[1]);
		ctx.lineTo(pt2[0], pt2[1]);
		ctx.lineTo(pt3[0], pt3[1]);
		ctx.lineTo(pt4[0], pt4[1]);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};

	// Ship.prototype.drawExhaustParticles = function (ctx) {
	// 	this.exhaustParticles.forEach(function(particle){
	// 		particle.draw(ctx);
	// 	})
	// };

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Listener = global.Listener = function(game) {
		this.timers = {};
		this.game = game;

		this.listen();
	}

	Listener.prototype.listen = function() {
		this.listenUp();
		this.listenDown();
	}

	Listener.prototype.listenUp = function() {
		var that = this;

		document.onkeyup = function (event) {
			switch (event.keyCode) {
				case 37:
				case 65:
					clearInterval(that.timers['left']);
					delete that.timers['left'];
					break;
				case 39:
				case 68:
					clearInterval(that.timers['right']);
					delete that.timers['right'];
					break;
				case 38:
				case 87:
					clearInterval(that.timers['move']);
					delete that.timers['move'];
					break;
				case 40:
				case 83:
					clearInterval(that.timers['dampen']);
					delete that.timers['dampen'];
					break;
				case 32:
					clearInterval(that.timers['fire']);
					delete that.timers['fire'];
					break;
			}
		}
	}

	Listener.prototype.listenDown = function () {
		var that = this;

		document.onkeydown = function (event) {
			// console.log(event.keyCode)
			switch (event.keyCode) {
				case 65:
				case 37:
					that.setTurnTimer('left');
					break;
				case 39:
				case 68:
					that.setTurnTimer('right');
					break;
				case 38:
				case 87:
					that.setMoveTimer();
					break;
				case 40:
				case 83:
					that.setDampenTimer();
					break;
				case 32:
					that.fire();
					break;
				case 80:
					that.game.pause();
					break;
			}
		}
	};

	Listener.prototype.setTurnTimer = function (dir) {
		var that = this;
		if (this.timers[dir]) {
			return
		}

		var percentage = 0;
		this.timers[dir] = setInterval(function(){
			percentage += 0.2;
			if (percentage > 1) { percentage = 1}
			that.game.turnShip(that.game.ship, dir, percentage)
		}, that.game.FPS)
	};

	Listener.prototype.setMoveTimer = function() {
		var that = this;
		if (this.timers['move']) {
			return
		}

		this.timers['move'] = setInterval(function(){
			that.game.powerShip(that.game.ship);
		}, that.game.FPS)
	}

	Listener.prototype.setDampenTimer = function() {
		var that = this;
		if (this.timers['dampen']) {
			return
		}

		this.timers['dampen'] = setInterval(function(){
			that.game.dampenShip(that.game.ship);
		}, that.game.FPS)
	}

	Listener.prototype.fire = function() {
		var that = this;
		if (this.timers['fire']) {
			return
		}
		this.game.fireShip(that.game.ship);
		this.timers['fire'] = setInterval(function(){
			that.game.fireShip(that.game.ship);
		}, that.game.ship.fireFrequency)
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Bullet = global.Bullet = function (ship) {
		this.ship = ship;
		this.orientation = ship.orientation.slice(0);
		var vel = ship.vel.add(ship.orientation.scale(10));
		var pos = ship.pos.slice(0)
		var color = 'red';
		this.damage = ship.damage;

		MovingObject.call(this, pos, vel, null, color)
	}

	Store.inherits(Bullet, MovingObject)

	Bullet.prototype.draw = function (ctx) {
		var start = this.pos;
		var end = this.pos.add(this.orientation.scale(10))

		ctx.beginPath();
		ctx.moveTo(start[0], start[1]);
		ctx.lineTo(end[0], end[1]);
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.color;
		ctx.stroke();
	}

	Bullet.prototype.isCollidedWithAsteroid = function (asteroid) {
		if (this.pos.distance(asteroid.pos) <= asteroid.radius) {
			return true;
		} else {
			return false;
		}
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Visuals = global.Visuals = function () {

	};

	Visuals.hit = function (canvas) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;');
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s');
		}, 100)
	};

	Visuals.fadeOut = function (domEl, stepValue, callback) {
		// must receive
		var i = 1;

		var interval = setInterval(function(){
			domEl.setAttribute('style', 'opacity:' + i + ';');

			if (i <= 0) {
				clearInterval(interval);
				if (callback) callback();
			}

			i = Math.round((i - stepValue) * 1000) / 1000;
		}, 30)
		
	};
})(Asteroids)
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var GameStarter = global.GameStarter = function (gameType) {
		this.initialize(gameType);
	};

	GameStarter.prototype.initialize = function (gameType) {
		switch (gameType) {
			case 'sp':
				this.startSinglePlayerGame();
				break;
			case 'hmpg':
				this.hostMultiPlayerGame();
				break;
			case 'jmpg':
				this.joinMultiPlayerGame();
				break;
			case 'jrmpg':
				this.joinRandomMultiPlayerGame();
				break;
		}
	};

	GameStarter.prototype.startSinglePlayerGame = function() {
		var canvas = this.createCanvas();
		var game = new window.Asteroids.Game(canvas);
		// game.initialize();

		window.game = game;
	};

	GameStarter.prototype.hostMultiPlayerGame = function() {
		alert('sorry, not available yet!')
		window.location = document.URL;
	};

	GameStarter.prototype.joinMultiPlayerGame = function() {
		alert('sorry, not available yet!')
		window.location = document.URL;
	};

	GameStarter.prototype.joinRandomMultiPlayerGame = function() {
		alert('sorry, not available yet!')
		window.location = document.URL;
	};

	GameStarter.prototype.createCanvas = function() {
		var canvasWrapper = document.createElement('div')
		canvasWrapper.id = 'canvas-wrapper';
		document.body.appendChild(canvasWrapper);

		var canvas = document.createElement("canvas");
		canvas.setAttribute("width", "1000");
		canvas.setAttribute("height", "500");

		canvasWrapper.appendChild(canvas);

		return canvas;
	};

	GameStarter.prototype.createSocket = function() {
		var socket = io.connect('/');
		Asteroids.SocketListener.startListening(socket);

		window.socket = socket;
	};

})(Asteroids)

window.onload = function() {

	// let's handle that index page
	var bs = document.getElementsByClassName('button');
	Asteroids.Store.assignOnclickToNodeList(bs, 
		function(data){
			// handle what should actually happen

			var lopwerPaneWrapper = document.getElementById('lower-pane-wrapper');
			var footer = document.getElementsByTagName('footer')[0];
			var mainWrapper = document.getElementById('main-wrapper');

			Asteroids.Visuals.fadeOut(footer, 0.3);
			Asteroids.Visuals.fadeOut(lopwerPaneWrapper, 0.1);
			setTimeout(function(){
				Asteroids.Visuals.fadeOut(mainWrapper, 0.2, function(){
					document.getElementById('main-wrapper').remove();

					new Asteroids.GameStarter(data.toElement.id)
				});
			}, 300)
		}
	);
	
}
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// should report ship's health, points, level
	var Readout = global.Readout = function (options) {
		this.ship = options.ship;
		this.game = options.game;
	};

	Readout.prototype.draw = function (ctx) {
		ctx.font = 'bold 15pt normal';
		ctx.fillStyle = 'white';
		ctx.fillText('Health: ' + this.ship.health, 20, 20);
		ctx.fillText('Level: ' + this.game.level, 20, 50);
	};

	///////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////
	// expanding text from the middle of the screen for level changes, announcesments, etc.
	var ExplodingText = global.ExplodingText = function (options) {
		this.game = options.game;
		this.independentTimer = options.independentTimer;
		this.txt = options.txt || 'default text';
		this.size = options.size || 10;
		this.growRate = options.growRate || 10;
		this.alpha = options.alpha || 1;
		this.alphaChangeRate = options.alphaChangeRate || 0.03;

		this.initialize();
	};

	ExplodingText.prototype.initialize = function() {
		var that = this;

		if (this.independentTimer) {
			var timer = setInterval(function(){
				if (that.alpha <= 0) {
					clearInterval(timer);
				} else {
					// that.draw(that.game.ctx);
					that.game.draw();
				}
			}, this.game.FPS)
		}
	};

	ExplodingText.prototype.draw = function(ctx) {
		ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')';
		ctx.textAlign = 'center';
		ctx.font = 'bold ' + this.size + 'pt normal';
		var x = this.game.WIDTH / 2;
		var y = (this.game.HEIGHT / 2) + (this.game.HEIGHT / 15);

		ctx.fillText(this.txt, x, y);
		ctx.textAlign = 'left';

		this.size += this.growRate;
		this.alpha -= this.alphaChangeRate;
	};


})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ExhaustParticle = global.ExhaustParticle = function (options) {
		this.ship = options.ship;
		this.pos = this.ship.pos.slice(0);
		this.radius = options.radius || 1;
		this.vel = this.ship.vel.add(this.ship.orientation.scale(-15).nudge());
		// this.color = ['orange', 'red', 'yellow', 'orange', 'orage'].sample();
		this.RGB = ['226,72,0','204,24,0','134,2,0','255,119,1'].sample();
	};

	Store.inherits(ExhaustParticle, MovingObject);

	ExhaustParticle.prototype.draw = function (ctx) {
		var x = this.pos[0];
		var y = this.pos[1];

		var radgrad = ctx.createRadialGradient(x,y,0,x,y,10);

	  radgrad.addColorStop(0, 'rgba(' + this.RGB + ',0.4)');
	  radgrad.addColorStop(0.1, 'rgba(' + this.RGB + ',.2)');
	  radgrad.addColorStop(1, 'rgba(' + this.RGB + ',0)');
	  
	  // draw shape
	  ctx.fillStyle = radgrad;
		ctx.fillRect(0, 0, 1000, 500);
	};

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Background = global.Background = function (game) {
		this.game = game;
		this.numStars = 100;
		this.stars = [];
		this.initialize();
	}

	Background.prototype.initialize = function () {
		var stars = [];
		var starOptions = {
			'height': this.game.HEIGHT,
			'width': this.game.WIDTH
		}

		for (var i = 0; i < this.numStars; i++) {
			this.stars.push(new global.Star(starOptions))
		}
	};

	Background.prototype.draw = function (ctx) {
		this.stars.forEach(function(star){
			star.draw(ctx);
		})
	};

	Background.prototype.move = function() {
		this.stars.forEach(function(star){
			star.move();
		})
	}
})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Star = global.Star = function (options) {
		this.height = height = options.height;
		this.width = width = options.width;
		this.radius = options.radius || 1;
		this.vel = options.vel || Store.randomVel().scale(0.02);
		this.pos = options.pos || [(Math.random() * width), (Math.random() * height)];
		this.color = ['#8A2C1F', 'blue', 'grey', 'grey', 'grey', 'grey', 'grey'].sample();
	};

	Store.inherits(Star, MovingObject)

	Star.prototype.draw = function (ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(
      this.pos[0],
      this.pos[1],
      this.radius,
      0,
      2 * Math.PI,
      false
    );

		ctx.fill();
	};
})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});
var SocketListener = Asteroids.SocketListener = {};

(function(global, SocketListener){

	var startListening = SocketListener.startListening = function (socket) {
		Asteroids.socket = socket;

		socket.on('connectionSuccessful', function() {
			console.log('socket connected to server ')
		});

		socket.on('testSuccess', function() {
			console.log('test received successfully!')
		});

		socket.on('test', function() {
			console.warn('I receieved test!')
		})
	};

	var sendInfo = global.sendInfo = function (game) {
		// got to send:
		// ship pos, vel, orientation
		var sendParams = {
			// ship: game.ship
		}
		// socket.emit('stepInfo')
	};

})(Asteroids, SocketListener)

