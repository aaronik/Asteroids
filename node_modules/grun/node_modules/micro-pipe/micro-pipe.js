/***/
typeof module != 'undefined' && (module.exports = micropipe);
function micropipe() {
  // support (fn, fn, ..., [opt]) or (Array(fn, fn,... ,fn), [opt])
  var actors = Array.prototype.slice.call(arguments);
  Array.isArray(actors[0]) && (actors = actors[0].concat(actors[1] || {}));
  var opts = typeof actors.slice(-1)[0] == 'function' ? {}: actors.pop();
  return next();
  function next() {
    var actor = actors.shift();
    typeof actor == 'function'
      && actor.apply(this, Array.prototype.slice.call(arguments).concat(next));
  }
}
