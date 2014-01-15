(function(global) {
	// Warning.  This is a naive approach to inheriting from Array.  The special length properties no longer work correctly.  See http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/ for a more detailed explanation.

	var Vector = global.Vector = function (arr) {
		if (arr && arr.constructor == Array) {
			this.push.apply(this, arr);
		} else {
			this.push.apply(this, arguments);
		}
	}

	// class inheritance //
	var Surrogate = function(){};
	Surrogate.prototype = Array.prototype;
	Vector.prototype = new Surrogate;
	///////////////////////

	Vector.prototype.normalize = function() {
    var mag = this.mag();

    if (mag == 0) {
      return new Vector([0, 0]);
    }
    
    return new Vector(this.map(function(el){return el / mag}));
  };

  Vector.prototype.rotate = function (rads) {
    if (this.length != 2) {
      return false
    }

    var rotatedArr = new Vector;
    rotatedArr.push(Math.cos(rads)*this[0] + Math.sin(rads)*this[1]);
    rotatedArr.push(Math.cos(rads)*this[1] - Math.sin(rads)*this[0]);

    return rotatedArr;
  };

  Vector.prototype.scale = function (mag) {
    return new Vector(this.map(function(el){return el * mag}));
  };

  Vector.prototype.add = function (vector) {
    var result = new Vector;

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(vector[i])
      } else {
        result.push(this[i] + vector[i])
      }
    }

    return result;

    return result;
  };

  Vector.prototype.subtract = function (vector) {
    var result = new Vector;

    for (var i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(-vector[i])
      } else {
        result.push(this[i] - vector[i])
      }
    }

    return result;
  };

  Vector.prototype.pow = function (scalar) {
    return this.map(function(el){
      return Math.pow(el, scalar);
    })
  };

  Vector.prototype.mag = function() {
    var squares = this.map(function(el){return el * el});
    var sumOfSquares = squares.reduce(function(sum, el){return sum += el});
    return Math.sqrt(sumOfSquares);
  };

  Vector.prototype.distance = function (vector) {
    if (this.length != vector.length) {
      return false
    }

    var distX = this[0] - vector[0];
    var distY = this[1] - vector[1];

    //dist = sqrt(distX^2 + distY^2)
    return Math.sqrt((distX * distX) + (distY * distY));
  };

  Vector.prototype.nudge = function (maxRadians) {
    // maxRadians is the max radians the vector will be nudged

    var maxRadians = maxRadians || Math.random() * 0.125;

    return this.rotate(Math.random() * (maxRadians / 2) * [-1, 1].sample());
  };

  Vector.prototype.slinky = function (maxDegree) {
    // stretch or shrink a vector at max maxDegree, randomly

    var maxDegree = maxDegree || Math.random() * 1;

    return this.scale(maxDegree + 1);
  };

  Vector.prototype.direction = function (foreignLoc) {
    return foreignLoc.subtract(this).normalize();
  };

  Vector.prototype.influence = function (direction, amount) {
    // direction is a this.length dimensional vector / array

    return this.add(direction.normalize().scale(amount));
  };

  Vector.prototype.gravitate = function (location, foreignMass, time) {
    // call on a pos

    //dist = 1/2 g t^2
    //g = GM / r^2

    // take my pos, add dist?
    var G = 0.0000000000667;
    var g = (G * foreignMass) / this.distance(location);
    var distance = 0.5 * g * Math.pow(time, 2);
    return this.add(this.direction(location).scale(distance));
  };

  // Vector.prototype.gravitate = function (location, foreignMass, localMass) {
  //   // call this on a velocity vector, influence it towards foreignMass at location

  //   var G = 0.0000000000667;
  //   var dist = this.distance(location);
  //   var forceScalar = G * foreignMass * localMass / (dist * dist);
  //   var forceVector = this.direction(location).scale(forceScalar);

  //   return this.add(forceVector);
  // };

  Vector.prototype.to_a = function() {
    var arr = [];

    for (var i = 0; i < this.length; i++) {
      arr.push(this[i]);
    }

    return arr;
  };
})(this);