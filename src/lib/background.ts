import Star from "./star"

type HeightWidth = { HEIGHT: number, WIDTH: number }

// TODO All of this can be made better by eliminating wrapping logic
// from here and just letting game take care of it by including stars
// as massive objects there
export default class Background {
  game: HeightWidth
  numStars: number
  stars: { [id: string]: Star } = {}
  starOptions: {
    height: number
    width: number
  }

	constructor(game: HeightWidth) {
		this.game = game
		this.numStars = 200
		this.starOptions = {
			height: game.HEIGHT,
			width: game.WIDTH
		}
		this.initialize()
	}

	initialize () {
		for (var i = 0; i < this.numStars; i++) {
      const star = new Star(this.starOptions)
			this.stars[star.id] = star
		}
	}

	draw (ctx: CanvasRenderingContext2D) {
		Object.values(this.stars).forEach(function(star){
			star.draw(ctx)
		})
	}

	move() {
		this.detect()

		Object.values(this.stars).forEach(function(star){
			star.move()
		})
	}

	detectOOBStars() {
		Object.values(this.stars).forEach((star) => {
			if ( (star.pos[0] + star.radius) < 0) {
				star.die()
			}

			if ( (star.pos[1] + star.radius) < 0) {
				star.die()
			}

			if ( (star.pos[0] - star.radius) > this.game.WIDTH) {
				star.die()
			}

			if ( (star.pos[1] - star.radius) > this.game.HEIGHT) {
				star.die()
			}
		})
	}

	detectDeadStars() {
		var bg = this

		Object.values(this.stars).forEach(function (star) {
			if (!star.alive) bg.replaceStar(star)
		})
	}

	replaceStar (star: Star) {
    delete this.stars[star.id]
    const newStar = new Star(this.starOptions)
    this.stars[newStar.id] = newStar
	}

	detect() {
		this.detectOOBStars()
		this.detectDeadStars()
	}
}
