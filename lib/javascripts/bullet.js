var Asteroids = this.Asteroids = (this.Asteroids || {});

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

})(Asteroids);