import MovingObject from "./movingObject"
import Ship from "./ship"
import Vector from "./vector"

type ExhaustParticleOptions = {
  ship: Ship
  radius?: number
}

export default class ExhaustParticle extends MovingObject {

  ship: Ship
  pos: Vector
  vel: Vector
  radius: number
  RGB: string
  health: number
  decayRate: number

	constructor(options: ExhaustParticleOptions) {
		const pos = options.ship.pos.scale(1)
		const vel = options.ship.vel.add(options.ship.orientation.scale(-15).nudge(0.25))
		const radius = options.radius || 10

    super(pos, vel, radius)

		this.ship = options.ship
		this.pos = pos
		this.vel = vel
		this.radius = radius
		this.RGB = ['226,72,0','204,24,0','134,2,0','255,119,1'][Math.floor(Math.random() * 4)]
		this.health = 0.2
		this.decayRate = 0.01
	}

  // unlike the other moving objects, to draw, this one needs to know these things
	draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
		var x = this.pos[0]
		var y = this.pos[1]

		var radgrad = ctx.createRadialGradient(x,y,0,x,y,this.radius)
	  radgrad.addColorStop(0, 'rgba(' + this.RGB + ',' + this.health + ')')
	  radgrad.addColorStop(1, 'rgba(' + this.RGB + ',0)')

	  // draw shape
	  ctx.fillStyle = radgrad
		ctx.fillRect(0, 0, width, height)

    // TODO Move this to step() method
		if (this.health - this.decayRate <= this.decayRate) {
			this.health = 0
		} else {
			this.health -= this.decayRate
		}
	}

}
