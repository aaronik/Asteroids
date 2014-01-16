var Asteroids = this.Asteroids = (this.Asteroids || {});

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
})(Asteroids);