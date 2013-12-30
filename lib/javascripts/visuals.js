var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Visuals = global.Visuals = function () {

	};

	Visuals.hit = function (canvas) {
		canvas.setAttribute('style', 'transition: all 0.1s; box-shadow: inset 0 0 30px 30px red;');
		setTimeout(function(){
			canvas.setAttribute('style', 'transition: all 0.1s');
		}, 100)
	};

	Visuals.fadeOut = function (domEl, stepValue, callback) {
		// must receive
		var i = 1;

		var interval = setInterval(function(){
			domEl.setAttribute('style', 'opacity:' + i + ';');

			if (i <= 0) {
				clearInterval(interval);
				if (callback) callback();
			}

			i = Math.round((i - stepValue) * 1000) / 1000;
		}, 30)
		
	};
})(Asteroids)