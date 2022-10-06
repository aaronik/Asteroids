import Store from "./store"
import Vector from "./vector"
import CustomArray from "./array"
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

    this.pos = pos
    this.vel = vel
    this.radius = radius
		this.height = options.height
		this.width = options.width
		this.color = new CustomArray('#8A2C1F', 'blue', 'grey', 'grey', 'grey', 'grey', 'grey').sample() as string
		this.alive = true
	}

	die() {
		this.alive = false
	}

	draw (ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color
    ctx.fillRect(
      this.pos[0],
      this.pos[1],
      2,
      2
    )
	}
}
