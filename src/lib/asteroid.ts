import Store from './store'
import Vector from './vector'
import CustomArray from './array'
import MassiveObject from './massiveObject'

export type AsteroidOptions = {
  radius: number
  pos: Vector
  vel: Vector
  id?: string
  color?: string
  edgeCount?: number
  edgeNudgers?: Vector
  rotationRate?: number
  orientation?: Vector
}

export default class Asteroid extends MassiveObject {
  static EDGE_COUNTS = new Vector([7, 8, 9, 10, 11, 12, 13, 14, 15])
	static RADII = new Vector([40, 25, 10])

  color: string
  health: number
  id: string
  edgeCount: number
  edgeNudgers: Vector
  rotationRate: number
  orientation: Vector
  mass: number

	constructor(opts: AsteroidOptions) {
    const mass = opts.radius * 10000000000

    super(opts.pos, opts.vel, opts.radius, mass)

    const unit = new Vector([-1, 1])

    this.mass = mass
    this.pos = new Vector(opts.pos)
    this.vel = new Vector(opts.vel)
    this.radius = opts.radius
		this.color = opts.color || Store.randomColor()
		this.health = opts.radius
		this.id = opts.id || Store.uid()
		this.edgeCount = opts.edgeCount || Asteroid.EDGE_COUNTS.sample() as number
		this.edgeNudgers = opts.edgeNudgers || Store.nudgers(this.edgeCount)
		this.rotationRate = opts.rotationRate || Math.random() * 0.1 * (unit.sample() as number)
		this.orientation = opts.orientation ? new Vector(opts.orientation) : new Vector([0, 1])
	}

  /**
  * @description Gives you the max speed an asteroid can have, based on the
  * size of the radius. The idea is that small asteroids can go faster
  * than large asteroids, which gives the game a cool effect IMO even though
  * it does not adhere to the reality of physics lol
  *
  * @param {string} radius - the size of the asteroid who's max speed we're
  * interested in
  */
	static maxSpeed(radius: number) {
		radius = radius || this.RADII[0]

		return Math.log(radius)
	}

	static randomAsteroid(dimX: number, dimY: number) {
		var vals = Asteroid.randomAsteroidValues(dimX, dimY)

		return new Asteroid(vals)
	}

	static randomAsteroidValues(dimX: number, dimY: number) {
		var radius = Asteroid.RADII[0]

    let posX: number = Math.random() * dimX
    let posY: number = Math.random() * dimY

		var vel = Store.randomVel(radius)
		var pos = new Vector([posX, posY])
		var color = Store.randomColor()
		var id = Store.uid()

		return {pos, vel, radius, color, id}
	}

	move() {
    super.move()
		this.orientation = this.orientation.rotate(this.rotationRate)
	}

	draw(ctx: CanvasRenderingContext2D) {
		var toLine
		ctx.beginPath()
		var start = this.pos.add(this.orientation.rotate(0).scale(this.radius * this.edgeNudgers[0]))
		ctx.moveTo(start[0], start[1])

		for (var i = 0; i < this.edgeCount; i++) {
			toLine = this.pos.add(this.orientation.rotate(i * 2 * Math.PI / this.edgeCount).scale(this.radius * this.edgeNudgers[i]))

			ctx.lineTo(toLine[0], toLine[1])
		}

		ctx.fillStyle = this.color
		ctx.fill()
	}

	explode(): AsteroidOptions[] {
		// create three new asteroids of size one smaller at pos +- a bit random

		var radius = Asteroid.RADII[Asteroid.RADII.indexOf(this.radius) + 1]

		if (!radius) {
			return []
		}

		var newAsteroidOpts = new CustomArray<AsteroidOptions>()

    // TODO offer variable number of units to explode into
		for (var i = 0; i < 3; i++) {
			const pos = this.pos.nearby(1, 20)[0]
			const vel = this.vel.nearby(1, 10)[0]
			const color = Store.randomColor()

			const opts = { pos, vel, radius, color }
			newAsteroidOpts.push(opts)
		}

    // console.log('explode, newAsteroidOpts:', newAsteroidOpts)

		return newAsteroidOpts
	}

	getState = () => {
		var state = {
			type: 'asteroid',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			health: this.health,
			color: this.color,
			rotationRate: this.rotationRate,
			edgeNudgers: this.edgeNudgers,
			orientation: this.orientation.to_a(),
			edgeCount: this.edgeCount
		}

		return state
	}

}
