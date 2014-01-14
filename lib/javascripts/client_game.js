var Asteroids = this.Asteroids = (this.Asteroids || {});

(function(global) {

	var Store = global.Store;

	var ClientGame = global.ClientGame = function (canvasEl) {
		this.canvas = canvasEl;
		this.ctx = canvasEl.getContext("2d");
		this.WIDTH = canvasEl.width;
		this.HEIGHT = canvasEl.height;
		this.exhaustParticles = [];
		this.explodingTexts = [];
		this.dropShadowColor = 'red';

		global.GlobalGame.call(this);
	}

	Store.inherits(ClientGame, global.GlobalGame);

	ClientGame.prototype.addReadout = function() {
		var options = {
			'game': this
		}

		this.readout = new global.Readout(options)
	};

	ClientGame.prototype.addBackground = function() {
		this.background = new global.Background(this);
	};

	ClientGame.prototype.lost = function() {
		this.stop();
		this.announce('You\'ve lost.', true);
		this.pause = null;
		global.Visuals.restartScreen();
	}

	ClientGame.prototype.draw = function() {
		var game = this;

		// clear the canvas
		this.ctx.clearRect(0,0,this.WIDTH, this.HEIGHT);

		// background
		this.background.draw(this.ctx);

		// ship exhaust particles
		this.exhaustParticles.forEach(function(ep){
			ep.draw(game.ctx);
		})

		// bullets
		this.bullets.forEach(function(bullet){
			bullet.draw(game.ctx);
		})

		// asteroids
		this.asteroids.forEach(function(asteroid){
			asteroid.draw(game.ctx);
		})

		// ship
		this.ships.forEach(function(ship){
			ship.draw(game.ctx);
		})

		// readout text
		this.readout.draw(this.ctx);

		// exploding texts
		this.explodingTexts.forEach(function(txt){
			txt.draw(game.ctx);
		})
	};

	ClientGame.prototype.move = function() {
		this.asteroids.forEach(function(asteroid){
			asteroid.move();
		});

		this.ships.forEach(function(ship){
			ship.move();
		})

		this.bullets.forEach(function(bullet){
			bullet.move();
		});

		this.exhaustParticles.forEach(function(ep){
			ep.move();
		})

		this.background.move();
	};

	ClientGame.prototype.announce = function (txt, independentTimer) {
		var independentTimer = independentTimer || false;

		var explodingTextOptions = {
			'game': this,
			'txt': txt,
			'independentTimer': independentTimer
		}

		this.explodingTexts.push(new global.ExplodingText(explodingTextOptions))
	}

	ClientGame.prototype.clearOOBObjects = function() {
		// this.clearOOBAsteroids();
		this.clearOOBBullets();
		this.clearOOBExhaustParticles();
	}

	ClientGame.prototype.clearOOBExhaustParticles = function() {
		var ep;
		var posX;
		var posY;

		for (var i = 0; i < this.exhaustParticles.length; i++) {
			ep = this.exhaustParticles[i];
			posX = ep.pos[0];
			posY = ep.pos[1];

			if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
				this.exhaustParticles.splice(i, 1);
			}
		}
	};

	ClientGame.prototype.handleExplodedText = function (txt) {
		this.explodingTexts.remove(txt);
	};

	ClientGame.prototype.detectExplodedTexts = function() {
		var game = this;

		this.explodingTexts.forEach(function(txt){
			if (txt.alpha <= 0) {
				game.handleExplodedText(txt);
			}
		})
	};

})(Asteroids);