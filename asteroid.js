var Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (pos, vel, rad, color) {
		this.COLOR = color || Store.randomColor();
		this.RADIUS = rad;

		MovingObject.call(this, pos, vel, this.RADIUS, this.COLOR);
	};

	Asteroid.MAX_SPEED_MULTIPLIER = 100;
	Asteroid.RADII = [40, 25, 10];

	inherits(Asteroid, MovingObject);

	Asteroid.maxSpeed = function (radius) {
		radius = radius || Asteroid.RADII[0];

		return Asteroid.MAX_SPEED_MULTIPLIER / radius
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

		var rad = Asteroid.RADII[Asteroid.RADII.indexOf(this.RADIUS) + 1];

		if (!rad) {
			return [];
		}

		var pos = this.pos;
		var newAsteroids = [];

		var vel;
		for (var i = 0; i < 3; i++) {
			vel = Store.randomVel(rad);
			newAsteroids.push(new Asteroid(pos, vel, rad));
		}

		return newAsteroids;
	};

})(Asteroids);