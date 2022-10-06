import { Direction } from "../types"
import Ship from "./ship"

type TimerAction = 'left' | 'right' | 'move' | 'dampen' | 'fire'

type Game = {
  pause: () => void
  FPS: number
  ship: Ship
  // turnShip: (dir: LateralDirection, percentage: number) => void
  // powerShip: () => void
  // dampenShip: () => void
  unsetRepetativeAction: (shipId: string, dir: Direction) => void
  setRepetativeAction: (shipId: string, dir: Direction) => void
  fireShip: () => void
}

// TODO: The problem with how this works now is that it's murder on the network
// and other users. Practically, two ships can hardly play before the computer starts cookin.
// Another way to structure this which would drastically improve network usage is instead of
// repeating the call over and over, on key down we can, say, set isTurning to true and on key up
// to false. Then on every step we can check each ship to see if it's turning
export default class KeyListener {
  timers: { [Property in TimerAction ]?: NodeJS.Timer } = {}
  game: Game

	constructor(game: Game) {
		this.game = game
		this.listen()
	}

	listen() {
		this.listenUp()
		this.listenDown()
	}

  stopListening() {
    document.onkeyup = () => {}
    document.onkeydown = () => {}
    Object.values(this.timers).forEach(timer => {
      clearInterval(timer)
    })
  }

	listenDown () {
    const shipId = this.game.ship.id

		document.onkeydown = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'ArrowLeft':
				case 'a':
          this.game.setRepetativeAction(shipId, 'left')
					break
				case 'ArrowRight':
				case 'd':
          this.game.setRepetativeAction(shipId, 'right')
					break
				case 'ArrowUp':
				case 'w':
          this.game.setRepetativeAction(shipId, 'up')
					break
				case 'ArrowDown':
				case 's':
        this.game.setRepetativeAction(shipId, 'down')
					break
				case " ":
					this.fire()
					break
				case "p":
					this.game.pause()
					break
			}
		}
	}

	listenUp() {
    const shipId = this.game.ship.id

		document.onkeyup = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'ArrowLeft':
				case 'a':
          this.game.unsetRepetativeAction(shipId, 'left')
					break
				case 'ArrowRight':
				case 'd':
          this.game.unsetRepetativeAction(shipId, 'right')
					break
				case 'ArrowUp':
				case 'w':
          this.game.unsetRepetativeAction(shipId, 'up')
					break
				case 'ArrowDown':
				case 's':
          this.game.unsetRepetativeAction(shipId, 'down')
					break
				case " ":
					clearInterval(this.timers['fire'])
					delete this.timers['fire']
					break
			}
		}
	}

	fire() {
		if (this.timers['fire']) {
			return
		}
		this.game.fireShip()
		this.timers['fire'] = setInterval(() => {
			this.game.fireShip()
		}, this.game.ship.fireFrequency)
	}

}
