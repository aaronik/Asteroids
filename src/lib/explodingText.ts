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
  txt: string
  size: number
  growRate: number
  alpha: number
  alphaChangeRate: number
  independentTimer: boolean
  onComplete?: () => void

  constructor(options: ExplodingTextOptions) {
    this.id = Store.uid()
    this.game = options.game
    this.txt = options.txt || 'default text'
    this.size = options.size || 10
    this.growRate = options.growRate || 10
    this.alpha = options.alpha || 1
    this.alphaChangeRate = options.alphaChangeRate || 0.015
    this.onComplete = options.onComplete
    this.independentTimer = options.independentTimer || false

    this.initialize()
  }

  initialize() {
    const game = this.game

    if (true) {
      const timer = setInterval(() => {
        if (this.alpha <= 0) {
          clearInterval(timer)
          game.handleExplodedText(this)
          game.draw()
        }
        else {
          this.step()
          game.draw()
        }
      }, 1000 / this.game.FPS)
    }
  }

  step() {
    this.size += this.growRate
    this.alpha -= this.alphaChangeRate / this.alpha
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
    ctx.textAlign = 'center'
    ctx.font = this.size + 'pt "Exo 2", sans-serif'
    var x = this.game.WIDTH / 2
    var y = (this.game.HEIGHT / 2) + (this.game.HEIGHT / 15)

    ctx.fillText(this.txt, x, y)
    ctx.textAlign = 'left'
  }

}
