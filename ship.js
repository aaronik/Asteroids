var Asteroids = (Asteroids || {});

(function(global){

	var Ship = global.Ship = function () {
		var pos = [window.game.WIDTH / 2, window.game.HEIGHT / 2];
		var vel = [0, 0];
		var radius = 20 / 3;
		this.orientation = [0,-1];
		this.rotateSpeed = 0.25;
		this.impulse = 0.4;
		this.dampenRate = 0.95;
		global.MovingObject.call(this, pos, vel, radius, 'black');
	};

	inherits(Ship, MovingObject);

	Ship.prototype.power = function () {
		this.vel = this.vel.add(this.orientation.scale(this.impulse));
	};

	Ship.prototype.turn = function (direction) {
		if (direction === 'left') {
			var mod = 1;
		} else {
			var mod = -1;
		}

		this.orientation = this.orientation.rotate(mod * this.rotateSpeed); 
	};

	Ship.prototype.dampen = function () {
		// this.vel = this.vel.scale(this.dampenRate);
		var ship = this;

		if (this.vel.mag() < 1) {
			this.vel = [0, 0];
		} else {
			this.vel = this.vel.scale(this.dampenRate);
		}

		// this.vel = this.vel.pow(0.9)
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