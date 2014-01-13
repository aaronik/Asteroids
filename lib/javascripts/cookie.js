var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {
	var Cookies = global.Cookies = {
		_getCookieObject: function() {
			var kvo = {};
			var kva;

			document.cookie.split(';').forEach(function (kv) {
				kva = kv.split('=');
				kvo[kva[0]] = kva[1];
			})

			return kvo;
		},

		get: function (cookieName) {
			return Cookies._getCookieObject()[cookieName];
		},

		set: function (cookieName, cookieValue) {
			document.cookie = cookieName + "=" + cookieValue;
		}
	}

})(Asteroids);