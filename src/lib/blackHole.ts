import MassiveObject from "./massiveObject"
import Store from "./store"
import Vector from "./vector"

export type BlackHoleOptions = {
  pos: Vector
  vel: Vector
  radius: number
  mass: number
  id?: string
}

const randValues = {
  pos: new Vector([100, 100]),
  vel: Store.randomVel(5),
  radius: 25,
  mass: 1000 * 1000 * 1000 * 1000 * 100
}

export default class BlackHole extends MassiveObject {
  mass: number
  accretionDisk: number = 1

  constructor(opts: BlackHoleOptions = randValues) {
    const pos = opts.pos ? new Vector(opts.pos) : randValues.pos
    const vel = opts.vel ? new Vector(opts.vel) : randValues.vel
    const radius = opts.radius || randValues.radius
    const mass = opts.mass || randValues.mass

    super(pos, vel, radius, mass)

    this.pos = pos
    this.vel = vel
    this.radius = radius
    this.mass = mass

    this.id = opts.id || Store.uid()
  }

  step() {
    const reductionValue = 0.05

    if (this.accretionDisk >= reductionValue) {
      this.accretionDisk -= reductionValue
    } else {
      this.accretionDisk = 0
    }
  }

  draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const [x, y] = this.pos
    const r = this.radius
    const b = this.radius + this.accretionDisk

    const gradient = ctx.createRadialGradient(x, y, r, x, y, b)

    gradient.addColorStop(0, 'rgba(0,0,0,1)')
    gradient.addColorStop(r / b, 'rgba(0,0,0,1)')
    gradient.addColorStop(1, 'rgba(241,90,34,0)')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

  }

  grow(amt: number) {
    this.radius += amt / 100
    this.accretionDisk += amt / 10
    this.mass += amt * 200
  }

  getState = () => {
    var stateObj = {
      type: 'blackHole',
      id: this.id,
      mass: this.mass,
      radius: this.radius,
      vel: this.vel.to_a(),
      pos: this.pos.to_a()
    }

    return stateObj
  }
}
