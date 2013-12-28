var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var Star = global.Star = function (options) {
		this.height = height = options.height;
		this.width = width = options.width;
		this.radius = options.radius || 1;
		this.vel = options.vel || Store.randomVel().scale(0.05);
		this.pos = options.pos || [(Math.random() * width), (Math.random() * height)];
		this.color = ['#8A2C1F', 'blue', 'grey', 'grey', 'grey', 'grey', 'grey'].sample();
	};

	inherits(Star, MovingObject)

	Star.prototype.draw = function (ctx) {
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