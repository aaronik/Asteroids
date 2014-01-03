var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global){
	// When initialized, Sessions will act just like a regular hash, but it will have some extra helpers that are designed to satisfy some requirements not met by the regular hash object.  Another way to do this would be to modify the hash prototype, but I'm not sure what kind of effects that may have on the node environment.


	var Sessions = global.Sessions = function() {

	};

	Sessions.prototype.keys = function() {
		var keys = [];

		for (i in this) {
			keys.push(i);
		}

		return keys;
	};

	Sessions.prototype.randomSession = function() {
		var sessions = [];

		for (i in this) {
			console.log(i)
			if (this[i] === true) {
				sessions.push(i);
			}
		}

		console.log(sessions)
		return sessions.sample();
	};
})(Asteroids)