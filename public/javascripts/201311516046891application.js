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
  })
  
})(Array.prototype);
(function (global){
inherits = global.inherits = ( global.inherits || function(obj1, obj2) {
	// obj1 should inherit from obj2

	function Surrogate() {	};
	Surrogate.prototype = obj2.prototype;
	obj1.prototype = new Surrogate();
});
})(this);
var Asteroids = (this.Asteroids || {});

(function(root){
	var Store = root.Store = (root.Store || {});

	Store.randomVel = function(radius){
		var speedX = Math.random() * root.Asteroid.maxSpeed(radius) * [-1, 1].sample();
		var speedY = Math.random() * root.Asteroid.maxSpeed(radius) * [-1, 1].sample();

		return [speedX, speedY];
	};

	Store.randomColor = function(){
		var colorString = "#";

		for (var i = 0; i < 6; i++) {
			colorString += [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'].sample();
		}

		return colorString;
	};
})(Asteroids)
// require('./inherits')
var Asteroids = (Asteroids || {});

(function (global){

	MovingObject = global.MovingObject = function (pos, vel, radius, color) {
		this.radius = radius;
		this.color = color;
		this.pos = pos;
		this.vel = vel;
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0]; 
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.draw = function (ctx) {
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
var Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (pos, vel, rad, color) {
		var color = color || Store.randomColor();

		MovingObject.call(this, pos, vel, rad, color);

		this.health = this.radius;
	};

	inherits(Asteroid, MovingObject);

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

module.exports = Asteroids.Asteroid;
var Asteroids = (this.Asteroids || {});

(function(global){

	Game = global.Game = function(canvasEl) {
		this.canvas = canvasEl;
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.bullets = [];
		this.FPS = 30;
		this.repopulationRate = 5;
		this.difficultyRate = 0.2;
		this.bgColor = 'white';
		this.dropShadowColor = 'red';
		this._counter = 0;
	};

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
		  this.asteroids.push(global.Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT));
		}
	};

	Game.prototype.addShip = function() {
		this.ship = new global.Ship([this.WIDTH / 2, this.HEIGHT / 2]);
	};

	Game.prototype.fire = function() {
		this.bullets.push(this.ship.fire());
	}

	Game.prototype.draw = function() {
		var game = this;
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})

		this.bullets.forEach(function(bullet){
			bullet.draw(game.ctx);
		})

		this.ship.draw(this.ctx);
	};

	Game.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		})

		this.ship.move();

		this.bullets.forEach(function(bullet){
			bullet.move();
		})
	};

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

	Game.prototype.explodeAsteroidsIfCollided = function() {
		var game = this;
		this.asteroidCollisions().forEach(function(asteroid){
			if (game.noExplodeAsteroids.indexOf(asteroid) === -1)
			game.explodeAsteroid(asteroid);
		})
	};

	Game.prototype.damageAsteroidsIfCollided = function() {
		var game = this;

		this.asteroidCollisionPairs().forEach(function(asteroidPair){
			if (game.noExplodeAsteroids.indexOf(asteroidPair[0]) === -1) {
				game.damageAsteroid(asteroidPair[0], asteroidPair[1].radius);
			}
		})
	};

	Game.prototype.damageAsteroidIfHit = function() {
		var game = this;

		this.hitAsteroids().forEach(function(asteroid){
			game.damageAsteroid(asteroid, game.ship.damage);
		})
	};

	Game.prototype.depopulateNoExplodeAsteroids = function() { // needs testing
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

	// Game.prototype.explodeAsteroidIfHit = function(asteroid) {
	// 	var game = this;
	// 	this.bullets.forEach(function(bullet){
	// 		game.asteroids.forEach(function(asteroid){
	// 			if (bullet.isCollidedWithAsteroid(asteroid)) {
	// 				game.explodeAsteroid(asteroid);
	// 				game.removeBullet(bullet);
	// 			}
	// 		})
	// 	})
	// };

	Game.prototype.explodeAsteroidsIfDestroyed = function() {
		var game = this;

		this.asteroids.forEach(function(asteroid){
			if (asteroid.health <= 0) {
				game.explodeAsteroid(asteroid);
			}
		})
	}

	Game.prototype.damageAsteroid = function(asteroid, damage) {
		asteroid.health -= damage;
	};

	Game.prototype.removeBullet = function (bullet) {
		this.bullets.remove(bullet);
	}

	Game.prototype.damageShipIfHit = function() {
		var game = this;

		this.asteroids.forEach(function(as){
			if (game.ship.isCollidedWith(as)) {
				game.explodeAsteroid(as);
				global.Visuals.Hit(game.canvas);
				game.ship.health -= as.radius;
			}
		})
	};

	Game.prototype.repopulateAsteroids = function() {
		if (this._counter % (this.FPS * this.repopulationRate) == 0) {
			this.addAsteroids(1);
		}
	};

	Game.prototype.modifyDifficulty = function() {
		if (this._counter % (this.FPS * this.repopulationRate) == 0) {
			this.changeAsteroidSpeed(this.difficultyRate);
		}
	};

	Game.prototype.changeAsteroidSpeed = function (amnt) {
		Asteroids.Asteroid.MAX_SPEED_MULTIPLIER += amnt;
	};

	Game.prototype.handleCollidingAsteroids = function() {
		// this.explodeAsteroidsIfCollided();
		this.damageAsteroidsIfCollided();
		this.explodeAsteroidsIfDestroyed();
		this.depopulateNoExplodeAsteroids();
	};

	Game.prototype.handleHitAsteroids = function() {
		// this.explodeAsteroidIfHit();
		this.damageAsteroidIfHit();
		// and this.explodeAsteroidIfDestroyed();
	};

	Game.prototype.handleHitShip = function() {
		this.damageShipIfHit();
		// make this.endGameIfShipDestroyed() or something
	};

	Game.prototype.handleCollidedBullets = function() {
		var game = this;

		this.collidedBullets().forEach(function(bullet){
			game.removeBullet(bullet);
		})
	};

	Game.prototype.step = function() {
		this._counter += 1;
		// this.clearOOBAsteroids();
		this.modifyDifficulty();
		this.clearOOBBullets();
		this.wrapMovingObjects();
		this.handleCollidingAsteroids();
		this.handleHitAsteroids();
		this.handleHitShip();
		this.handleCollidedBullets();
		this.repopulateAsteroids();
		this.draw();
		this.move();
	};

	Game.prototype.pause = function() {
		if (this['mainTimer']) {
			this.stop();
		} else {
			this.start();
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
		new global.Listener(this);
		this.start();
		document.getElementsByTagName('body')[0].bgColor = this.bgColor;
	};


	Game.prototype.setUp = function() {
		this.asteroids = [];
		this.noExplodeAsteroids = [];
		this.addAsteroids(1);
		this.asteroids[0].vel = [0,0];
		this.ship.pos = [100,100];
		this.asteroids[0].pos = [250,250];
	};

})(Asteroids);
var Asteroids = (this.Asteroids || {});

(function(global){

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

		global.MovingObject.call(this, pos, vel, radius, 'black');
	};

	inherits(Ship, MovingObject);

	Ship.prototype.power = function () {
		this.vel = this.vel.add(this.orientation.scale(this.impulse));
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
		var ship = this;

		if (this.vel.mag() < 1) {
			this.vel = [0, 0];
		} else {
			this.vel = this.vel.scale(this.dampenRate);
		}
	}

	Ship.prototype.fire = function () {
		return new global.Bullet(this);
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
			that.game.ship.turn(dir, percentage)
		}, that.game.FPS)
	};

	Listener.prototype.setMoveTimer = function() {
		var that = this;
		if (this.timers['move']) {
			return
		}

		this.timers['move'] = setInterval(function(){
			that.game.ship.power();
		}, that.game.FPS)
	}

	Listener.prototype.setDampenTimer = function() {
		var that = this;
		if (this.timers['dampen']) {
			return
		}

		this.timers['dampen'] = setInterval(function(){
			that.game.ship.dampen();
		}, that.game.FPS)
	}

	Listener.prototype.fire = function() {
		var that = this;
		if (this.timers['fire']) {
			return
		}
		this.game.fire();
		this.timers['fire'] = setInterval(function(){
			that.game.fire();
		}, that.game.ship.fireFrequency)
	}

})(Asteroids);
var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Bullet = global.Bullet = function (ship) {
		this.ship = ship;
		this.orientation = ship.orientation.slice(0);
		var vel = ship.vel.add(ship.orientation.scale(10));
		var pos = ship.pos.slice(0)
		var color = 'red';

		MovingObject.call(this, pos, vel, null, color)
	}

	inherits(Bullet, MovingObject)

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

	Visuals.Hit = function (canvas) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;');
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s');
		}, 100)
	};
})(Asteroids)
window.onload = function() {
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", "500");
	canvas.setAttribute("height", "500");
	canvas.setAttribute("background", 'black');

	var canvasWrapper = document.getElementById("canvas-wrapper");
	canvasWrapper.appendChild(canvas);

	var game = new window.Asteroids.Game(canvas);
	game.initialize();

	window.game = game;
}