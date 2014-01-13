var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Bullet = global.Bullet = function (ship, opts) {
		var opts = opts || {};
		this.ship = ship;
		this.orientation = opts.orientation || ship.orientation.slice(0);
		var vel = opts.vel || ship.vel.add(ship.orientation.scale(10));
		var pos = opts.pos || ship.pos.slice(0);
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

	Bullet.prototype.isCollidedWithRadialObject = function (asteroid) {
		if (this.pos.distance(asteroid.pos) <= asteroid.radius) {
			return true;
		} else {
			return false;
		}
	}

	Bullet.prototype.getState = function() {
		var state = {
			type: 'bullet',
			radius: this.radius,
			pos: this.pos,
			vel: this.vel,
			id: this.id,
			orientation: this.orientation,
			damage: this.damage,
			color: this.color,
			shipID: this.ship.id
		}

		return state;
	}

})(Asteroids);