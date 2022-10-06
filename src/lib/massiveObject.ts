import MovingObject from './movingObject'
import Vector from './vector'

export default class MassiveObject extends MovingObject {
  mass: number // in KiloGrams
  G: number = 0.0000000000667

  gravitate(foreignMassiveObject: MassiveObject) {
    const foreignPosition = foreignMassiveObject.pos
    const foreignMass = foreignMassiveObject.mass
    let dist = this.pos.distance(foreignPosition)
    if (dist === 0) dist = 100
    const g = (this.G * foreignMass) / Math.pow(dist, 2)
    const adderVector = this.pos.direction(foreignPosition).scale(g)
    this.vel = this.vel.add(adderVector)
  }

  constructor(pos: Vector, vel: Vector, radius: number, mass: number) {
    super(pos, vel, radius)
    this.mass = mass
  }
}
