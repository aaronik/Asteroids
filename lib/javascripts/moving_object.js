var Asteroids = this.Asteroids = (this.Asteroids || {});

(function (global){

	var Store = global.Store;

	MovingObject = global.MovingObject = function (pos, vel, radius) {
		this.radius = radius;
		this.pos = new Vector(pos);
		this.vel = new Vector(vel);
		this.id = this.id || Store.uid();
	};

	MovingObject.prototype.move = function() {
		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
	};

	MovingObject.prototype.gravitate = function (massiveObject) {
		var location = massiveObject.pos;
		this.vel = this.vel.add(this.pos.gravity(location, 100000000000));
	};

	MovingObject.prototype.isCollidedWith = function (otherObject) {
		var otherRadius = otherObject.radius;
		var dist = this.pos.distance(otherObject.pos)

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