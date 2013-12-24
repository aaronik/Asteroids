var nodeunit = require('nodeunit');
var micropipe = require('../micro-pipe');

module.exports = nodeunit.testCase({
  'args': function(t) {
    var cnt = 0;
    micropipe(function(next) {
      cnt++, next()
    }, function(next) {
      cnt++, next()
    }, function(next) {
      t.equal(cnt, 2), t.done()
    });
  },
  'array': function(t) {
    var cnt = 0;
    var fns = [];
    fns.push(function(next) {
      cnt++, next()
    });
    fns.push(function(next) {
      cnt++, next()
    });
    fns.push(function(next) {
      t.equal(cnt, 2), t.done()
    });
    micropipe(fns);
  },
  'result': function(t) {
    var cnt = 0;
    micropipe(function(next) {
      cnt++, next('b')
    }, function(v, next) {
      cnt++, t.equal(v, 'b'), next('c')
    }, function(v, next) {
      t.equal(cnt, 2), t.equal(v, 'c'), t.done();
    });
  }
});
