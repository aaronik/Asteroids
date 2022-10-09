import { randomUnit } from '../util'
import Vector from './vector'

// TODO Not sure any of this actually needs to exist. Most have
// common library implementations
export default class Store {
	static randomVel(radius: number = 1) {
		const speedX = Math.random() * Math.log(radius) * randomUnit()
		const speedY = Math.random() * Math.log(radius) * randomUnit()

		return new Vector([speedX, speedY])
	}

	static randomColor() {
		let colorString = "#"

		for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * 16)
      colorString += [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'][randomIndex]
		}

		return colorString
	}

  /**
  * @description Get up to a 32 character random id. I removed the '-''s because this game
  * cuts these up a lot and wants to see characters.
  */
	static uid(length: number = 32) {
    const uid = crypto.randomUUID().split('').filter(c => c !== '-').join('').slice(0, length)
		return uid
	}

	static nudgers(count: number) {
		const nudgers = new Vector()
		let nudger

		for (let i = 0; i < count; i++) {
			nudger = (Math.random() * 0.4) + 0.8
			nudgers.push(nudger)
		}

		return nudgers
	}
}
