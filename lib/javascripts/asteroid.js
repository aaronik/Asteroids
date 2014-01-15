var Asteroids = this.Asteroids = (this.Asteroids || {});

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

})(Asteroids);