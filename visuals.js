var Asteroids = this.Asteroids;

(function(global){
	var Visuals = global.Visuals = function () {

	};

	Visuals.Hit = function (canvas) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;');
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s');
		}, 100)
	};
})(Asteroids)