
/*
 * GET home page.
 */

exports.index = function(req, res){
	var min = (req.app.get('env') == 'production') ? ".min" : "";
	console.log('min')
	console.log(min)

  res.render('index', { title: "Aaronik's Asteroids", min: min });
};