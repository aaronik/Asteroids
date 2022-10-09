import Game from "../game/game"
import Store from "./store"

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

// TODO Fix alpha decay rate when game timer has stopped. Currently it stops
// decaying and just shows up big and white and it slows its growth a lot making
// the game look laggy even though it's just a weird logarithmic thing
export default class ExplodingText {
  id: string
  game: Game
  independentTimer: boolean
  txt: string
  size: number
  growRate: number
  alpha: number
  alphaChangeRate: number
  onComplete?: () => void

	constructor(options: ExplodingTextOptions) {
    this.id = Store.uid()
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
