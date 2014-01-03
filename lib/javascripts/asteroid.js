var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	var Asteroid = global.Asteroid = function (opts) {
		this.color = opts.color || Store.randomColor();
		this.health = opts.radius;
		this.id = opts.id || null;

		MovingObject.call(this, opts.pos, opts.vel, opts.radius)
	};

	Store.inherits(Asteroid, MovingObject);

	Asteroid.MAX_SPEED_MULTIPLIER = 1;
	Asteroid.RADII = [40, 25, 10];

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

		var radius = Asteroid.RADII[Asteroid.RADII.indexOf(this.radius) + 1];

		if (!radius) {
			return [];
		}

		var newAsteroidOpts = [];

		var vel;
		var color;
		for (var i = 0; i < 3; i++) {
			var pos = [];
			pos[0] = this.pos[0]// + [1,2,3].sample() * this.radius;
			pos[1] = this.pos[1]// + [1,2,3].sample() * this.radius;

			vel = Store.randomVel(radius);
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
			pos: this.pos,
			vel: this.vel,
			id: this.id,
			health: this.health,
			color: this.color
		}

		return state;
	}

})(Asteroids);