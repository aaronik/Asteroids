var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){

	var Store = global.Store;

	var ExhaustParticle = global.ExhaustParticle = function (options) {
		this.ship = options.ship;
		this.pos = this.ship.pos.slice(0);
		this.radius = options.radius || 1;
		this.vel = this.ship.vel.add(this.ship.orientation.scale(-15).nudge());
		// this.color = ['orange', 'red', 'yellow', 'orange', 'orage'].sample();
		this.RGB = ['226,72,0','204,24,0','134,2,0','255,119,1'].sample();
	};

	Store.inherits(ExhaustParticle, MovingObject);

	ExhaustParticle.prototype.draw = function (ctx) {
		var x = this.pos[0];
		var y = this.pos[1];

		var radgrad = ctx.createRadialGradient(x,y,0,x,y,10);

	  radgrad.addColorStop(0, 'rgba(' + this.RGB + ',0.4)');
	  radgrad.addColorStop(0.1, 'rgba(' + this.RGB + ',.2)');
	  radgrad.addColorStop(1, 'rgba(' + this.RGB + ',0)');
	  
	  // draw shape
	  ctx.fillStyle = radgrad;
		ctx.fillRect(0, 0, 1000, 500);
	};

})(Asteroids);