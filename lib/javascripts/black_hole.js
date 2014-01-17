var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var Store = global.Store;

	var BlackHole = global.BlackHole = function (opts) {
		var opts = opts ? opts : {};
		var pos = opts.pos ? new Vector(opts.pos) : [100, 100];
		var vel = opts.vel ? new Vector(opts.vel) : Store.randomVel();
		var radius = opts.radius || 50;
		this.mass = opts.mass || 100000000000;
		this.id = opts.id || null;

		MovingObject.call(this, pos, vel, radius);
	}

	Store.inherits(BlackHole, MovingObject);

	BlackHole.randomBlackHoleValues = function() {
		var opts = {
			pos: [100, 100],
			vel: Store.randomVel(),
			radius: 50,
			mass: 100000000000
		}

		return opts;
	};

	BlackHole.prototype.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
	};

	BlackHole.prototype.grow = function (amt) {
		this.radius += amt / 10;
		this.mass += amt * 10;
	};

	BlackHole.prototype.getState = function() {
		var stateObj = {
			type: 'blackHole',
			id: this.id,
			mass: this.mass,
			radius: this.radius,
			vel: this.vel.to_a(),
			pos: this.pos.to_a()
		}

		return stateObj
	}
})(Asteroids);