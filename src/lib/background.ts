import CustomArray from './array'
import Star from "./star"

type HeightWidth = { HEIGHT: number, WIDTH: number }

// TODO All of this can be made better by eliminating wrapping logic
// from here and just letting game take care of it by including stars
// as massive objects there
export default class Background {
  game: HeightWidth
  numStars: number
  stars: CustomArray<Star>
  starOptions: {
    height: number
    width: number
  }

	constructor(game: HeightWidth) {
		this.game = game
		this.numStars = 200
		this.stars = new CustomArray()
		this.starOptions = {
			height: game.HEIGHT,
			width: game.WIDTH
		}
		this.initialize()
	}

	initialize () {
		for (var i = 0; i < this.numStars; i++) {
			this.stars.push(new Star(this.starOptions))
		}
	}

	draw (ctx: CanvasRenderingContext2D) {
		this.stars.forEach(function(star){
			star.draw(ctx)
		})
	}

	move() {
		this.detect()

		this.stars.forEach(function(star){
			star.move()
		})
	}

	detectOOBStars() {
		this.stars.forEach((star) => {
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

		this.stars.forEach(function (star) {
			if (!star.alive) bg.replaceStar(star)
		})
	}

	replaceStar (star: Star) {
		this.stars.remove(star)
		this.stars.push(new Star(this.starOptions))
	}

	detect() {
		this.detectOOBStars()
		this.detectDeadStars()
	}
}
