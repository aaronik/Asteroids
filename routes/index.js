var Asteroids = require('../Asteroids.js');

exports.index = function (req, res) {
	var min = (req.app.get('env') == 'production') ? ".min" : "";

  res.render('index', { title: "Aaronik's Asteroids", min: min });
};

exports.new = function (req, res) {
	var uid = Asteroids.Store.uid(5);

	res.send({uid: uid})
}