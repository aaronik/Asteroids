(function (global){
inherits = global.inherits = ( global.inherits || function(obj1, obj2) {
	// obj1 should inherit from obj2

	function Surrogate() {	};
	Surrogate.prototype = obj2.prototype;
	obj1.prototype = new Surrogate();
});
})(this);