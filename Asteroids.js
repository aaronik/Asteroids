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
  
})(Array.prototype);;(function(global) {
	// Warning.  This is a naive approach to inheriting from Array.  The special length properties no longer work correctly.  See http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/ for a more detailed explanation.

	var Vector = global.Vector = function (arr) {
		if (arr && arr.constructor == Array) {
			this.push.apply(this, arr);
		} else {
			this.push.apply(this, arguments);
		}
	}

	// class inheritance //
	var Surrogate = function(){};
	Surrogate.prototype = Array.prototype;
	Vector.prototype = new Surrogate;
	///////////////////////

	Vector.prototype.normalize = function() {
    var mag = this.mag();

    if (mag == 0) {
      return new Vector([0, 0]);
    }
    
    return new Vector(this.map(function(el){return el / mag}));
  };

  Vector.prototype.rotate = function (rads) {
    if (this.length != 2) {
      return false
    }

    var rotatedArr = new Vector;
    rotatedArr.push(Math.cos(rads)*this[0] + Math.sin(rads)*this[1]);
    rotatedArr.push(Math.cos(rads)*this[1] - Math.sin(rads)*this[0]);

    return rotatedArr;
  };

  Vector.prototype.scale = function (mag) {
    return new Vector(this.map(function(el){return el * mag}));
  };

  Vector.prototype.add = function (vector) {
    var result = new Vector;

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(vector[i])
      } else {
        result.push(this[i] + vector[i])
      }
    }

    return result;

    return result;
  };

  Vector.prototype.subtract = function (vector) {
    var result = new Vector;

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(-vector[i])
      } else {
        result.push(this[i] - vector[i])
      }
    }

    return result;
  };

  Vector.prototype.pow = function (scalar) {
    return this.map(function(el){
      return Math.pow(el, scalar);
    })
  };

  Vector.prototype.mag = function() {
    var squares = this.map(function(el){return el * el});
    var sumOfSquares = squares.reduce(function(sum, el){return sum += el});
    return Math.sqrt(sumOfSquares);
  };

  Vector.prototype.distance = function (vector) {
    if (this.length != vector.length) {
      return false
    }

    var distX = this[0] - vector[0];
    var distY = this[1] - vector[1];

    //dist = sqrt(distX^2 + distY^2)
    return Math.sqrt((distX * distX) + (distY * distY));
  };

  Vector.prototype.nudge = function (maxRadians) {
    // maxRadians is the max radians the vector will be nudged

    var maxRadians = maxRadians || Math.random() * 0.125;

    return this.rotate(Math.random() * (maxRadians / 2) * [-1, 1].sample());
  };

  Vector.prototype.slinky = function (maxDegree) {
    // stretch or shrink a vector at max maxDegree, randomly

    var maxDegree = maxDegree || Math.random() * 1;

    return this.scale(maxDegree + 1);
  };

  Vector.prototype.direction = function (foreignLoc) {
    return foreignLoc.subtract(this).normalize();
  };

  Vector.prototype.influence = function (direction, amount) {
    // direction is a this.length dimensional vector / array

    return this.add(direction.normalize().scale(amount));
  };

  Vector.prototype.gravity = function (location, foreignMass) {
    var G = 0.0000000000667;
    var dist = this.distance(location);
    if (dist == 0) dist = 0.001;
    var g = (G * foreignMass) / Math.pow(dist, 1);
    return this.direction(location).scale(g);
  }

  Vector.prototype.to_a = function() {
    var arr = [];

    for (var i = 0; i < this.length; i++) {
      arr.push(this[i]);
    }

    return arr;
  };
})(this);;var Asteroids = this.Asteroids = (this.Asteroids || {});

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

		return new Vector(speedX, speedY);
	};

	Store.randomColor = function() {
		var colorString = "#";

		for (var i = 0; i < 6; i++) {
			colorString += [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'].sample();
		}

		return colorString;
	};

	Store.uid = function(num) {
		num = num || 32;

		var arr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

		var uid = '';

		for (var i = 0; i < num; i++) {
			uid += arr.sample();
		}

		return uid;
	};

	Store.assignOnclickToNodeList = function (nodeList, callback) {
		for (var i = 0; i < nodeList.length; i++) {
			nodeList[i].onclick = callback;
		}
	};

	Store.nudgers = function (count) {
		var nudgers = new Vector();
		var nudger;

		for (var i = 0; i < count; i++) {
			nudger = (Math.random() * 0.4) + 0.8;
			nudgers.push(nudger);
		}

		return nudgers;
	}

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
})(Asteroids);var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	MovingObject = global.MovingObject = function (pos, vel, radius) {
		this.radius = radius;
		this.pos = new Vector(pos);
		this.vel = new Vector(vel);
		this.id = this.id || Store.uid();
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.gravitate = function (massiveObject) {
		var location = massiveObject.pos;
		this.vel = this.vel.add(this.pos.gravity(location, 100000000000));
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


})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (opts) {
		this.color = opts.color || Store.randomColor();
		this.health = opts.radius;
		this.id = opts.id || null;
		this.edgeCount = opts.edgeCount || Asteroid.EDGE_COUNTS.sample();
		this.edgeNudgers = opts.edgeNudgers || Store.nudgers(this.edgeCount);
		this.rotationRate = opts.rotationRate || Math.random() * 0.1 * [-1, 1].sample();
		this.orientation = opts.orientation ? new Vector(opts.orientation) : new Vector([0, 1]);

		MovingObject.call(this, opts.pos, opts.vel, opts.radius);
	};

	Store.inherits(Asteroid, MovingObject);

	Asteroid.MAX_SPEED_MULTIPLIER = 1;
	Asteroid.RADII = [40, 25, 10];
	Asteroid.EDGE_COUNTS = [7, 8, 9, 10, 11, 12, 13, 14, 15];

	Asteroid.maxSpeed = function (radius) {
		radius = radius || Asteroid.RADII[0];

		return (Asteroid.MAX_SPEED_MULTIPLIER / 5) * Math.log(radius);
	};

	Asteroid.randomAsteroid = function (dimX, dimY) {
		var vals = Asteroid.randomAsteroidValues(dimX, dimY)

		return new Asteroid(vals);
	};

	Asteroid.randomAsteroidValues = function (dimX, dimY) {
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
		var color = Store.randomColor();
		var id = Store.uid();

		return {pos: pos, vel: vel, radius: radius, color: color, id: id};
	};

	Asteroid.prototype.move = function() {
		// like ruby's 'super' but much less awesome
		this.__proto__.__proto__.move.call(this);

		this.orientation = this.orientation.rotate(this.rotationRate);
	}

	Asteroid.prototype.draw = function (ctx) {
		var toLine;
		ctx.beginPath();
		var start = this.pos.add(this.orientation.rotate(0).scale(this.radius * this.edgeNudgers[0]))
		ctx.moveTo(start[0], start[1]);

		for (var i = 0; i < this.edgeCount; i++) {
			toLine = this.pos.add(this.orientation.rotate(i * 2 * Math.PI / this.edgeCount).scale(this.radius * this.edgeNudgers[i]))

			ctx.lineTo(toLine[0], toLine[1]);
		}

		ctx.fillStyle = this.color;
		ctx.fill();
	}

	Asteroid.prototype.explode = function() {
		// create three new asteroids of size one smaller at pos

		var radius = Asteroid.RADII[Asteroid.RADII.indexOf(this.radius) + 1];

		if (!radius) {
			return [];
		}

		var newAsteroidOpts = [];

		var vel;
		var color;
		for (var i = 0; i < 3; i++) {
			var pos = [];
			pos[0] = this.pos[0];
			pos[1] = this.pos[1];

			vel = Store.randomVel(radius);
			// vel = this.vel.nudge(1).slinky();
			color = Store.randomColor();

			var opts = { pos: pos, vel: vel, radius: radius, color: color }
			newAsteroidOpts.push(opts);
		}

		return newAsteroidOpts;
	};

	Asteroid.prototype.getState = function() {
		var state = {
			type: 'asteroid',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			health: this.health,
			color: this.color,
			rotationRate: this.rotationRate,
			edgeNudgers: this.edgeNudgers,
			orientation: this.orientation.to_a(),
			edgeCount: this.edgeCount
		}

		return state;
	}

})(Asteroids);;var Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Ship = global.Ship = function (opts) {
		if (!opts) var opts = {};
		var pos = opts.pos || new Vector([100, 100]);
		var vel = opts.vel || new Vector([0, 0]);
		var radius = opts.radius || 20 / 3;
		this.orientation = opts.orientation ? new Vector(opts.orientation) : new Vector([0,-1]);
		this.rotateSpeed = opts.rotateSpeed || 0.25;
		this.impulse = opts.impulse || 0.4;
		this.dampenRate = opts.dampenRate || 0.95;
		this.fireFrequency = opts.fireFrequency || 200;
		this.health = opts.health || 40;
		this.damage = opts.damage || 15;
		this.id = opts.id || null;
		this.borderColor = opts.borderColor || Store.randomColor();
		this.fillColor = opts.fillColor || Store.randomColor();

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

	Ship.prototype.fire = function (bulletOpts) {
		this.recoil();
		return new global.Bullet(this, bulletOpts);
	}

	Ship.prototype.recoil = function() {
		if (this.kineticBullets) {
			this.vel = this.vel.subtract(this.orientation.scale(this.bulletWeight))
		}
	}

	Ship.prototype.draw = function (ctx, pos, or) {
		var height = this.radius * 3;
		var base = 0.3;
		var or = or || this.orientation;

		var start = pos || this.pos;
		var pt1 = start.add(or.scale(height / 1.5));
		var pt2 = pt1.add(or.scale(-height).rotate(base));
		var pt3 = pt1.add(or.scale(-height).rotate(-base));
		var pt4 = pt1;

		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.borderColor;
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

	Ship.prototype.getState = function() {
		var state = {
			type: 'ship',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			orientation: this.orientation.to_a(),
			rotateSpeed: this.rotateSpeed,
			impulse: this.impulse,
			dampenRate: this.dampenRate,
			fireFrequency: this.fireFrequency,
			health: this.health,
			damage: this.damage,
			kineticBullets: this.kineticBullets,
			bulletWeight: this.bulletWeight,
			borderColor: this.borderColor,
			fillColor: this.fillColor
		}

		return state;
	}

})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Bullet = global.Bullet = function (ship, opts) {
		var opts = opts || {};
		this.ship = ship;
		this.orientation = opts.orientation ? new Vector(opts.orientation) : ship.orientation.scale(1);
		var vel = opts.vel ? new Vector(opts.vel) : ship.vel.add(ship.orientation.scale(10));
		var pos = opts.pos ? new Vector(opts.pos) : ship.pos.scale(1);
		this.color = opts.color || ship.borderColor || 'red';
		this.damage = opts.damage || ship.damage;
		this.id = opts.id || null; // assigned in moving_object.js

		MovingObject.call(this, pos, vel, null)
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

	Bullet.prototype.getState = function() {
		var state = {
			type: 'bullet',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			orientation: this.orientation.to_a(),
			damage: this.damage,
			color: this.color,
			shipID: this.ship.id
		}

		return state;
	}

})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var Store = global.Store;

	var BlackHole = global.BlackHole = function (opts) {
		var opts = opts ? opts : {};
		var pos = opts.pos || new Vector([100, 100]);
		var vel = opts.vel || new Vector([-1, -1]);
		var radius = opts.radius || 50;

		MovingObject.call(this, pos, vel, radius);
	}

	Store.inherits(BlackHole, MovingObject);

	BlackHole.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
	}
})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

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

})(Asteroids);var Asteroids = this.Asteroids = (this.Asteroids || {});

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

			object.move();
		})

		// this.asteroids.forEach(function (asteroid) {
		// 	asteroid.move();
		// });

		// this.ships.forEach(function (ship) {
		// 	ship.move();
		// });

		// this.bullets.forEach(function (bullet) {
		// 	bullet.move();
		// });

		// this.blackHoles.forEach(function (blackHole) {
		// 	blackHole.move();
		// })
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

})(Asteroids);;var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ServerListener = global.ServerListener = function (socket, io, gameID) {
		this.sockets = [socket];
		this.gameID = gameID;
		this.io = io;
		// this.game is assigned in server_game.js
	};


	ServerListener.prototype.initialize = function() {
		var that = this;
		var gameID = this.gameID;
		var game = this.game;
		var sr = this.game.serverResponder;

		this.sockets.forEach(function(socket){

			socket.removeAllListeners();

			socket.on('test', function (data) {
				console.log('test call received');
				sr.testSuccess();
			})

			socket.on('requestSessionsStatus', function() {
				console.log('emitting sessions status');
				sr.requestSessionsStatus();
			})

			// game
			socket.on('fireShip', function (bulletOpts) {
				game.fireShip(null, bulletOpts);
				sr.fireShip(socket, bulletOpts);
			})

			socket.on('addShip', function (shipOpts) {
				game.addShip(shipOpts);
				sr.addShip(socket, shipOpts);
				socket.shipID = shipOpts.id;
			})

			socket.on('powerShip', function (shipOpts) {
				var ship = game.get(shipOpts.shipID);
				game.powerShip(ship);
				sr.powerShip(socket, shipOpts);
			})

			socket.on('turnShip', function (turnOpts) {
				game.turnShip(turnOpts);
				sr.turnShip(socket, turnOpts);
			})

			socket.on('dampenShip', function (dampenOpts) {
				game.dampenShip(dampenOpts);
				sr.dampenShip(socket, dampenOpts);
			})

			socket.on('requestFullState', function() {
				sr.sendFullState();
			})

			socket.on('shipState', function (shipOpts) {
				game.updateShip(shipOpts);
			})

			socket.on('pause', function() {
				game.pause();
				sr.pause(socket);
			})

			socket.on('disconnect', function() {
				that[socket.id] = setTimeout(function() {
					that.removeSocket(socket);
				}, 15000)
			})

			socket.on('connection', function() {
				if (that[socket.id]) {
					clearTimeout(that[socket.sessionid]);
				}
			})
		})

	};

	ServerListener.prototype.addSocket = function (socket) {
		this.sockets.push(socket);
		this.initialize();
		this.game.serverResponder.sendFullState();
	};

	ServerListener.prototype.removeSocket = function (socket) {
		socket.removeAllListeners();
		this.sockets.remove(socket);
		this.initialize();
		this.game.removeShip(socket.shipID);
	};

})(Asteroids);// OK server_game.js holds all the state, server_listener.js listens for client speak, server_responder.js will give the clients what they ask for.  Not totally sure if this file will be necessary, it may be able to be combined into the server_game.  Either way, it'll interact heavily with the server_game.

// Also one thing to remember is that every event is going to have to have the gameID in it.

var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store

	var ServerResponder = global.ServerResponder = function (socket, io, gameID, sessions) {
		this.sockets = [socket];
		this.gameID = gameID;
		this.io = io;
		this.sessions = sessions;
		// this.game assigned in server_game.js;
	}

	ServerResponder.prototype.sendAsteroid = function (asteroidOpts) {
		this.broadcast('addAsteroid', asteroidOpts);
	}

	ServerResponder.prototype.fireShip = function (socket, bulletOpts) {
		this.relay(socket, 'fireShip', bulletOpts);
	}

	ServerResponder.prototype.addShip = function (socket, shipOpts) {
		this.relay(socket, 'addShip', shipOpts);
	}

	ServerResponder.prototype.removeBullet = function (bulletOpts) {
		this.broadcast('removeBullet', bulletOpts);
	}

	ServerResponder.prototype.powerShip = function (socket, shipOpts) {
		this.relay(socket, 'powerForeignShip', shipOpts);
	}

	ServerResponder.prototype.turnShip = function (socket, turnOpts) {
		this.relay(socket, 'turnForeignShip', turnOpts);
	}

	ServerResponder.prototype.dampenShip = function (socket, dampenOpts) {
		this.relay(socket, 'dampenForeignShip', dampenOpts);
	}

	ServerResponder.prototype.levelUp = function() {
		this.broadcast('levelUp');
	}

	ServerResponder.prototype.explodeAsteroid = function (asteroidOpts) {
		this.broadcast('explodeAsteroid', asteroidOpts)
	}

	ServerResponder.prototype.pause = function (socket) {
		this.relay(socket, 'pause', {});
	}

	ServerResponder.prototype.sendFullState = function() {
		var fullStateArray = this.game.getFullState();
		var fullStateObject = { fullStateArray: fullStateArray }
		this.broadcast('fullState', fullStateObject);
	}

	ServerResponder.prototype.testSuccess = function() {
		this.broadcast('testSuccess');
	}

	ServerResponder.prototype.requestSessionsStatus = function() {
		this.broadcast('sessionsStatus', this.sessions.keys());
	}

	ServerResponder.prototype.hitShip = function (opts) {
		this.broadcast('foreignHitShip', opts);
	}

	ServerResponder.prototype.handleDestroyedShip = function (shipIDOpt) {
		this.broadcast('destroyedShip', shipIDOpt);
	}


	// private (esque)
	ServerResponder.prototype.broadcast = function (event, object) {
		this.io.sockets.in(this.gameID).emit(event, object);
	}

	ServerResponder.prototype.relay = function (socket, event, object) {
		socket.broadcast.to(this.gameID).emit(event, object);
	}
})(Asteroids);var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// When initialized, Sessions will act just like a regular hash, but it will have some extra helpers that are designed to satisfy some requirements not met by the regular hash object.  Another way to do this would be to modify the hash prototype, but I'm not sure what kind of effects that may have on the node environment.


	var Sessions = global.Sessions = function() {

	};

	Sessions.prototype.keys = function() {
		var keys = [];

		for (i in this) {
			keys.push(i);
		}

		return keys;
	};

	Sessions.prototype.randomSession = function() {
		var sessions = [];

		for (i in this) {
			if (this[i] === true) {
				sessions.push(i);
			}
		}

		return sessions.sample();
	};
})(Asteroids)
module.exports = Asteroids;
global.Vector = this.Vector;