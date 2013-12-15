var Asteroids = this.Asteroids;

(function(global){
	var Bullet = global.Bullet = function (ship) {
		var vel = ship.vel.add(ship.orientation.scale(10));
		var pos = ship.pos
		var color = 'black';

		MovingObject.call(this, pos, vel, null, color)
	}

	Bullet.prototype.draw = function (ctx) {
		var start = this.pos;
		var end = this.pos.add(this.vel.normalize().scale(10))

		ctx.beginPath();
		ctx.moveTo(start[0], start[1]);
		ctx.lineTo(end[0], end[1]);
		ctx.lineWidth = 3;
		ctx.strokeStyle = this.color;
		ctx.stroke();
	}

})(Asteroids);