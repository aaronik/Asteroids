var Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Ship = global.Ship = function (opts) {
		if (!opts) var opts = {};
		var pos = opts.pos || [100, 100];
		var vel = opts.vel || [0, 0];
		var radius = opts.radius || 20 / 3;
		this.orientation = opts.orientation || [0,-1];
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

	Ship.prototype.fire = function() {
		this.recoil();
		return new global.Bullet(this);
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
			pos: this.pos,
			vel: this.vel,
			id: this.id,
			orientation: this.orientation,
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

})(Asteroids);