import Game from "../game/game"

type ExplodingTextOptions = {
  game: Game
  independentTimer: boolean
  txt?: string
  size?: number
  growRate?: number
  alpha?: number
  alphaChangeRate?: number
  onComplete?: () => void
}

export default class ExplodingText {
  game: Game
  independentTimer: boolean
  txt: string
  size: number
  growRate: number
  alpha: number
  alphaChangeRate: number
  onComplete?: () => void

	constructor(options: ExplodingTextOptions) {
		this.game = options.game
		this.independentTimer = options.independentTimer
		this.txt = options.txt || 'default text'
		this.size = options.size || 10
		this.growRate = options.growRate || 10
		this.alpha = options.alpha || 1
		this.alphaChangeRate = options.alphaChangeRate || 0.02
    this.onComplete = options.onComplete

		this.initialize()
	}

	initialize() {
    const game = this.game

		if (this.independentTimer) {
			const timer = setInterval(() => {
				if (this.alpha <= 0) {
          clearInterval(timer)
          game.handleExplodedText(this)
          game.draw()
        }
        else {
          game.draw()
        }
			}, this.game.FPS)
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
		ctx.textAlign = 'center'
		ctx.font = this.size + 'pt "Exo 2", sans-serif'
		var x = this.game.WIDTH / 2
		var y = (this.game.HEIGHT / 2) + (this.game.HEIGHT / 15)

		ctx.fillText(this.txt, x, y)
		ctx.textAlign = 'left'

		this.size += this.growRate
		this.alpha -= this.alphaChangeRate / this.alpha
	}

}
