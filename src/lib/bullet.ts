import Vector from "./vector"
import Ship from './ship'
import Store from "./store"
import MassiveObject from "./massiveObject"

export type BulletOptions = {
  ship: Ship
  orientation?: Vector
  color?: string
  id?: string
  pos?: Vector
  vel?: Vector
  damage?: number
}

export default class Bullet extends MassiveObject {

  ship: Ship
  orientation: Vector
  damage: number
  color: string
  id: string

	constructor(opts: BulletOptions) {
    const ship = opts.ship

		var vel = opts.vel ? new Vector(opts.vel) : ship.vel.add(ship.orientation.scale(10))
		var pos = opts.pos ? new Vector(opts.pos) : ship.pos.scale(1)

		super(pos, vel, 1, 1)

		this.ship = ship
		this.orientation = opts.orientation ? new Vector(opts.orientation) : ship.orientation.scale(1)
		this.color = opts.color || ship.borderColor || 'red'
		this.damage = opts.damage || ship.damage
		this.id = opts.id || Store.uid()
    this.mass = 0.1 // in kg
	}

	draw = (ctx: CanvasRenderingContext2D) => {
		var start = this.pos
		var end = this.pos.add(this.orientation.scale(10))

		ctx.beginPath()
		ctx.moveTo(start[0], start[1])
		ctx.lineTo(end[0], end[1])
		ctx.lineWidth = 3
		ctx.strokeStyle = this.color
		ctx.stroke()
	}

	getState = () => {
		var state = {
			type: 'bullet',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			orientation: this.orientation.to_a(),
			damage: this.damage,
			color: this.color,
			shipId: this.ship.id
		}

		return state
	}

}
