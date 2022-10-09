import Store from "./store"
import Vector from "./vector"
import MovingObject from "./movingObject"

type StarOptions = {
  height: number
  width: number
  radius?: number
  vel?: Vector
  pos?: Vector
  color?: string
  alive?: boolean
}

export default class Star extends MovingObject {
  height: number
  width: number
  radius: number
  vel: Vector
  pos: Vector
  color: string
  alive: boolean
  mass: 1 = 1 // TODO this might slow things a lot

	constructor(options: StarOptions) {
		const posi = new Vector([(Math.random() * options.width), (Math.random() * options.height)])
	  const pos = options.pos ? options.pos : posi
		const radius = options.radius || 1
		const vel = options.vel ? options.vel : Store.randomVel().scale(0.02)
    super(pos, vel, radius)

    const rand = Math.random()
    if (rand < 0.15) { this.color = '#8A2C1F' } // redish
    else if (rand < 0.3) { this.color = 'blue' }
    else { this.color = 'grey' }

    this.pos = pos
    this.vel = vel
    this.radius = radius
		this.height = options.height
		this.width = options.width
		this.alive = true
	}

	die() {
		this.alive = false
	}

	draw = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = this.color
    ctx.fillRect(
      this.pos[0],
      this.pos[1],
      2,
      2
    )
	}
}
