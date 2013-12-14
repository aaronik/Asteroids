// require('./inherits')
var Asteroids = (Asteroids || {});

(function (global){

	MovingObject = global.MovingObject = function (pos, vel, radius, color) {
		this.radius = radius;
		this.color = color;
		this.pos = pos;
		this.vel = vel;
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.draw = function (ctx) {
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

	MovingObject.prototype.isCollidedWith = function (otherObject) {
		var otherRadius = otherObject.radius;
		var otherPos = otherObject.pos;

		var distX = this.pos[0] - otherPos[0];
		var distY = this.pos[1] - otherPos[1];

		//dist = sqrt(distX^2 + distY^2)
		var dist = Math.sqrt((distX * distX) + (distY * distY));

		if((otherRadius + this.radius) > dist){
			return true;
		} else {
			return false;
		}
	};

	// a strange function.  Never gets called.
	MovingObject.prototype.start = function (canvas) {
		var game = this;
		var ctx = canvasEl.getContext("2d");

		window.setInterval(function () {
			as1.move();
			as1.draw(ctx);

		}, 100);
	};


})(Asteroids);