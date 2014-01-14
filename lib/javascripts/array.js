(function(A){

  A.sample = (A.sample || function(count) {
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
  })

  A.remove = (A.remove || function (el) {
    for (var i = 0; i < this.length; i++) {
      if (el === this[i]) {
        this.splice(i, 1);
        return this;
      }
    }

    return false;
  });

  A.uniq = (A.uniq || function() {
    var uniqHash = {};
    var returnArray = [];

    for (var i = 0; i < this.length; i++) {
      if (!uniqHash[this[i]]) {
        uniqHash[this[i]] = true;
        returnArray.push(this[i]);
      }
    }

    return returnArray
  });
  
})(Array.prototype);