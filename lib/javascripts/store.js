var Asteroids = (this.Asteroids || {});

(function(root){
	var Store = root.Store = (root.Store || {});

	Store.randomVel = function(radius){
		var speedX = Math.random() * root.Asteroid.maxSpeed(radius) * [-1, 1].sample();
		var speedY = Math.random() * root.Asteroid.maxSpeed(radius) * [-1, 1].sample();

		return [speedX, speedY];
	};

	Store.randomColor = function(){
		var colorString = "#";

		for (var i = 0; i < 6; i++) {
			colorString += [1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'].sample();
		}

		return colorString;
	};

	// Store.randomRGB = function() {
	// 	// will output a string like '123, 231, 111'
	// 	var string = '';

	// 	string += Math.floor(Math.random() * 256);
	// 	string += ', ';
	// 	string += Math.floor(Math.random() * 256);
	// 	string += ', ';
	// 	string += Math.floor(Math.random() * 256);

	// 	return string;
	// }
})(Asteroids)