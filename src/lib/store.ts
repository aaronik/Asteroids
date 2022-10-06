import CustomArray from './array'
import Vector from './vector'
import Asteroid from './asteroid'

// TODO Not sure any of this actually needs to exist. Most have
// common library implementations
export default class Store {
	static randomVel(radius: number = 1) {
    // @ts-ignore
    window.Vector = Vector; window.Asteroid = Asteroid
    const unit = new CustomArray(-1, 1)

		const speedX = Math.random() * Asteroid.maxSpeed(radius) * unit.sample()
		const speedY = Math.random() * Asteroid.maxSpeed(radius) * unit.sample()

		return new Vector([speedX, speedY])
	}

	static randomColor() {
		let colorString = "#"

		for (let i = 0; i < 6; i++) {
			colorString += new CustomArray<string | number>(1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F').sample()
		}

		return colorString
	}

	static uid(length: number = 32) {
		const arr = new CustomArray("1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z")

		let uid = ''

		for (let i = 0; i < length; i++) {
			uid += arr.sample()
		}

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
