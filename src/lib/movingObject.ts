import MassiveObject from "./massiveObject"
import Store from "./store"
import Vector from "./vector"

// TODO we could use to go through all of lib and make sure
// they are playing correctly with this moving object class.
export default class MovingObject {
  radius: number
  pos: Vector
  vel: Vector
  id: string

  getState: () => any

  constructor(pos: Vector, vel: Vector, radius: number) {
    this.radius = radius
    this.pos = new Vector(pos)
    this.vel = new Vector(vel)
    this.id = Store.uid()
  }

  move() {
    this.pos[0] += this.vel[0]
    this.pos[1] += this.vel[1]
  }

  isCollidedWith(otherObject: MovingObject) {
    var otherRadius = otherObject.radius
    var dist = this.pos.distance(otherObject.pos)

    if ((otherRadius + this.radius) > dist) {
      return true
    } else {
      return false
    }
  }
}
