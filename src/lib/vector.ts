import CustomArray from './array'

// TODO maybe there's an existing implementation of this
export default class Vector extends CustomArray<number> {
  constructor(coords: number[] | Vector = []) {
    super(...coords)
  }

	normalize() {
    const mag = this.mag()

    if (mag === 0) {
      return new Vector([0, 0])
    }

    return new Vector(this.to_a().map(el => el / mag))
  }

  rotate(rads: number) {
    if (this.length !== 2) {
      throw new Error('rotate must be called on 2d vector')
    }

    const x = Math.cos(rads)*this[0] + Math.sin(rads)*this[1]
    const y = Math.cos(rads)*this[1] - Math.sin(rads)*this[0]

    const rotatedArr = new Vector([x, y])
    return rotatedArr
  }

  scale(mag: number) {
    return new Vector(this.to_a().map(el => el * mag))
  }

  add(vector: Vector) {
    const result = new Vector()

    for (let i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(vector[i])
      } else {
        result.push(this[i] + vector[i])
      }
    }

    return result
  }

  subtract(vector: Vector) {
    const result = new Vector()

    for (let i = 0; i < vector.length; i++) {
      if (!this[i]) {
        result.push(-vector[i])
      } else {
        result.push(this[i] - vector[i])
      }
    }

    return result
  }

  pow(scalar: number) {
    return this.to_a().map(function(el){
      return Math.pow(el, scalar)
    })
  }

  mag() {
    const squares = this.to_a().map(function(el){return el * el})
    const sumOfSquares = squares.reduce(function(sum, el){return sum += el})
    return Math.sqrt(sumOfSquares)
  }

  distance(vector: Vector): number {
    if (this.length !== vector.length) {
      return 0
    }

    const distX = this[0] - vector[0]
    const distY = this[1] - vector[1]

    //dist = sqrt(distX^2 + distY^2)
    return Math.sqrt((distX * distX) + (distY * distY))
  }

  /**
   * Rotates the vector about its base a little bit randomly
   *
   * @param {number} maxRadians maximum number of radians about which to rotate the vec
   */
  nudge(maxRadians: number = Math.random() * 0.125) {
    const unit = new CustomArray(-1, 1)
    return this.rotate(Math.random() * (maxRadians / 2) * unit.sample())
  }

  /**
   * stretch or shrink a vector up to maxDegree, randomly
   */
  slinky(maxDegree: number = 2) {
    return this.scale(Math.random() * maxDegree)
  }

  /**
  * @description Get the normalized direction Vector which points from
  * this vector to the `foreignLoc` (foreign location) given.
  */
  direction(foreignLoc: Vector) {
    return foreignLoc.subtract(this).normalize()
  }


  /**
  * @description Takes a this.length dimensional Vector `direction`, scales that by `amount`,
  * and adds that to {this}.
  */
  influence(direction: Vector, amount: number) {
    // direction is a this.length dimensional vector / array

    return this.add(direction.normalize().scale(amount))
  }

  /**
  * @description Get `num` randomly placed Vectors within a distance of `distance`
  */
  nearby(num: number, distance: number) {
    const vectors: Vector[] = []

    for (let i = 0; i < num; i++) {
      const vector = new Vector()

      for (let j = 0; j < this.length; j++) {
        const rand = this[j] + (0.5 - Math.random()) * distance // TODO inspect this suspecious math
        vector.push(rand)
      }

      vectors.push(vector)
    }

    return vectors
  }

  to_a() {
    const arr = []

    for (let i = 0; i < this.length; i++) {
      arr.push(this[i])
    }

    return arr
  }
}
