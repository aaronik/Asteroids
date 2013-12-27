(function(global){
	var inherits = global.inherits = (global.inherits || function (child, parent) {
		function Surrogate(){};
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate();
	})
})(this);