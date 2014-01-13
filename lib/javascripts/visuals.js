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

	Visuals.restartScreen = function() {
		var that = this;

		var wrapper = document.getElementById('restart-screen-wrapper');
		var el = document.getElementById('restart-screen');

		// make it visible
		wrapper.setAttribute('style', 'display:block;');

		el.onclick = function() {
			window.location = document.URL;
		}
	};

	Visuals.fadeOut = function (domEl, stepValue, callback) {
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

	Visuals.fade = function (domEl, initialValue, finalValue, stepValue, callback) {
		var i = initialValue;

		var interval = setInterval(function () {
			domEl.setAttribute('style', 'opacity:' + i + ';');

			var cond1 = (initialValue < finalValue && i >= finalValue);
			var cond2 = (initialValue > finalValue && i <= finalValue);

			if (cond1 || cond2) {
				clearInterval(interval);
				if (callback) callback();
			}

			i = Math.round((i + stepValue) * 1000) / 1000;
		}, 30)
	}
})(Asteroids)