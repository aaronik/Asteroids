(function(A){

  A.sample = function(count) {
    sampleArray = [];
    count = count || 1;

    for(var i = 0; i < count; i++){
      sampleArray.push(this[Math.floor(Math.random() * this.length)])
    }

    if (count == 1) {
      return sampleArray[0];
    } else {
      return sampleArray;
    }
  }

  A.normalize = function() {
    var squares = this.map(function(el){return el * el});
    var sumOfSquares = squares.reduce(function(sum, el){return sum += el});
    var mag = Math.sqrt(sumOfSquares);

    return this.map(function(el){return el / mag});
  };

  A.rotate = function (rads) {
    if (this.length != 2) {
      return false
    }

    var rotatedArr = [];
    rotatedArr.push(Math.cos(rads)*this[0] + Math.sin(rads)*this[1]);
    rotatedArr.push(Math.cos(rads)*this[1] - Math.sin(rads)*this[0]);

    return rotatedArr;
  };

  A.scale = function (mag) {
    return this.map(function(el){return el * mag});
  }

  A.add = function (vector) {
    var result = [];

    for (i=0; i<this.length; i++) {
      result.push(this[i] + vector[i])
    }

    return result;
  }

  
})(Array.prototype);

