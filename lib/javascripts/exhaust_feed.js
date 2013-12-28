var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var ExhaustFeed = global.ExhaustFeed = function () {
		this.exhaustParticles = [];
	};

	ExhaustFeed.prototype.draw = function (ctx) {
		this.exhaustParticles.forEach(function(particle){
			particle.draw(ctx);
		})
	};
	
})(Asteroids);