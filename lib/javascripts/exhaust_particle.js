var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Store = global.Store;

	var ExhaustParticle = global.ExhaustParticle = function (options) {
		this.ship = options.ship;
		this.pos = this.ship.pos.slice(0);
		this.radius = options.radius || 1;
		this.vel = this.ship.vel.add(this.ship.orientation.scale(-10).nudge());
		this.color = ['orange', 'red', 'yellow', 'orange', 'orage'].sample()
	};

	inherits(ExhaustParticle, MovingObject);

	ExhaustParticle.prototype.draw = function (ctx) {
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

})(Asteroids);