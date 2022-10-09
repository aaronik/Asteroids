import Store from "./store"
import Vector from "./vector"
import Bullet, { BulletOptions } from './bullet'
import ExhaustParticle from './exhaustParticle'
import MassiveObject from "./massiveObject"
import { Direction } from "../types"

export type ShipOptions = {
  pos?: Vector
  vel?: Vector
  radius?: number
  orientation?: Vector
  rotateSpeed?: number
  impulse?: number
  dampenRate?: number
  fireFrequency?: number
  health?: number
  damage?: number
  id?: string
  borderColor?: string
  fillColor?: string
  kineticBullets?: boolean
  bulletWeight?: number
  mass?: number
  actions?: { [dir in Direction]?: true }
  addExhaustParticles: (particles: ExhaustParticle[]) => void
}

export default class Ship extends MassiveObject {
  pos: Vector
  vel: Vector
  radius: number
  orientation: Vector
  rotateSpeed: number
  impulse: number
  dampenRate: number
  fireFrequency: number
  health: number
  damage: number
  id: string
  borderColor: string
  fillColor: string
  kineticBullets: boolean
  bulletWeight: number
  mass: number
  actions: { [dir in Direction]?: true } = {}
  addExhaustParticles: (particles: ExhaustParticle[]) => void

	constructor(opts: ShipOptions) {
		const pos = opts.pos ? new Vector(opts.pos) : new Vector([100, 100])
		const vel = opts.vel ? new Vector(opts.vel) : new Vector([0, 0])
		const radius = opts.radius || 20 / 3
    const mass = opts.mass || 20000

    super(pos, vel, radius, mass)

    this.pos = pos
    this.vel = vel
    this.radius = radius
    this.mass = mass

		this.orientation = opts.orientation ? new Vector(opts.orientation) : new Vector([0,-1])
		this.rotateSpeed = opts.rotateSpeed || 0.25
		this.impulse = opts.impulse || 0.4
		this.dampenRate = opts.dampenRate || 0.95
		this.fireFrequency = opts.fireFrequency || 200
		this.health = opts.health || 40
		this.damage = opts.damage || 15
		this.id = opts.id ? opts.id : Store.uid()
		this.borderColor = opts.borderColor || Store.randomColor()
		this.fillColor = opts.fillColor || Store.randomColor()
    this.addExhaustParticles = opts.addExhaustParticles
    this.actions = opts.actions || {}

		this.kineticBullets = true
		this.bulletWeight = 0.5
	}

  setAction(dir: Direction) {
    this.actions[dir] = true
  }

  unsetAction(dir: Direction) {
    delete this.actions[dir]
  }

	private power () {
		this.vel = this.vel.add(this.orientation.scale(this.impulse))
    this.addExhaustParticles(this.releaseExhaust())
	}

	private turn (direction: 'left' | 'right', percentage: number) {
    let mod: number

		if (direction === 'left') {
			mod = 1
		} else {
			mod = -1
		}

		this.orientation = this.orientation.rotate(mod * this.rotateSpeed * percentage)
	}

	private dampen () {
		let dampenRate = this.dampenRate

		if (this.vel.mag() < 3) {
			// this.vel = [0, 0]
			// dampenRate = 0.5 // This made stopping way faster once you were slowed down
			this.vel = this.vel.scale(dampenRate)
		} else {
			dampenRate = this.dampenRate
			this.vel = this.vel.scale(dampenRate)
		}
	}

	fire (bulletOpts?: BulletOptions) {
		this.recoil()
		return new Bullet(bulletOpts || { ship: this })
	}

	recoil() {
		if (this.kineticBullets) {
			this.vel = this.vel.subtract(this.orientation.scale(this.bulletWeight))
		}
	}

	releaseExhaust (count: number = 2): ExhaustParticle[] {
		const exhaustParticleOptions = {
			ship: this
		}

		const particles = []

		for (let i = 0; i < count; i++) {
			particles.push(new ExhaustParticle(exhaustParticleOptions))
		}

		return particles
	}

  step() {
    for (let dir in this.actions) {
      switch (dir) {
        case 'left':
        case 'right': this.turn(dir, 0.8); break
        case 'up': this.power(); break
        case 'down': this.dampen(); break
      }
    }
  }

  // We take a pos and orientation here so that readout can draw us in the right place
	draw = (ctx: CanvasRenderingContext2D, pos?: Vector, or?: Vector) => {
		const height = this.radius * 3
		const base = 0.3
		or = or ? new Vector(or) : this.orientation
    pos = pos ? new Vector(pos) : this.pos

		const pt1 = pos.add(or.scale(height / 1.5))
		const pt2 = pt1.add(or.scale(-height).rotate(base))
		const pt3 = pt1.add(or.scale(-height).rotate(-base))
		const pt4 = pt1

		ctx.fillStyle = this.fillColor
		ctx.strokeStyle = this.borderColor
		ctx.lineWidth = 3
		ctx.beginPath()
		ctx.moveTo(pt1[0], pt1[1])
		ctx.lineTo(pt2[0], pt2[1])
		ctx.lineTo(pt3[0], pt3[1])
		ctx.lineTo(pt4[0], pt4[1])
		ctx.closePath()
		ctx.stroke()
		ctx.fill()
	}

	getState = () => {
		const state = {
			type: 'ship' as 'ship',
			radius: this.radius,
			pos: this.pos.to_a(),
			vel: this.vel.to_a(),
			id: this.id,
			orientation: this.orientation.to_a(),
			rotateSpeed: this.rotateSpeed,
			impulse: this.impulse,
			dampenRate: this.dampenRate,
			fireFrequency: this.fireFrequency,
			health: this.health,
			damage: this.damage,
			kineticBullets: this.kineticBullets,
			bulletWeight: this.bulletWeight,
			borderColor: this.borderColor,
			fillColor: this.fillColor,
      actions: this.actions
		}

		return state
	}
}
