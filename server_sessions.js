var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	var Sessions = global.Sessions = function() {

	};

	Sessions.prototype.keys = function() {
		var keys = [];

		for (i in this) {
			keys.push(i);
		}

		return keys;
	}
})(Asteroids)