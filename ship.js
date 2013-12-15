var Asteroids = (Asteroids || {});

(function(global){

	var Ship = global.Ship = function () {
		this.pos = [window.game.WIDTH / 2, window.game.HEIGHT / 2];
		this.vel = [0, 0];
		this.radius = 20;
		this.orientation = [0,-1];
		this.rotateSpeed = 0.2;
		this.impulse = 2;
		// global.MovingObject.call(this, pos, vel, radius, 'black');
	};

	// inherits(Ship, MovingObject);

	Ship.prototype.power = function () {
		this.vel = this.vel.add(this.orientation.scale(this.impulse));
	};

	Ship.prototype.turn = function (direction) {
		if (direction === 'left') {
			var mod = -1;
		} else {
			var mod = 1;
		}

		this.orientation = this.orientation.rotate(mod * this.rotateSpeed); 
	};

	Ship.prototype.move = function () {
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
	};

	Ship.prototype.draw = function (ctx) {
		var height = this.radius;
		var base = 0.3;
		var or = this.orientation;

		var start = this.pos;
		// var pt1 = start.add(or.scale(height).rotate(base));
		// var pt2 = start.add(or.scale(height).rotate(-base));
		var pt1 = start.add(or.scale(height / 2));
		var pt2 = pt1.add(or.scale(-height).rotate(base));
		var pt3 = pt1.add(or.scale(-height).rotate(-base));
		var pt4 = pt1;

		ctx.fillStyle = 'black';
		ctx.strokeStyle = 'red';
		ctx.beginPath();
		ctx.moveTo(start[0], start[1]);
		ctx.lineTo(pt1[0], pt1[1]);
		ctx.lineTo(pt2[0], pt2[1]);
		ctx.lineTo(pt3[0], pt3[1]);
		ctx.lineTo(pt4[0], pt4[1]);
		ctx.lineTo(start[0], start[1]);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	};



})(Asteroids);