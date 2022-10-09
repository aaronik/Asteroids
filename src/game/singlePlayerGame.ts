import Game from './game'

export default class SinglePlayerGame extends Game {

	initialize() {
		this.addAsteroids(this.level * 3)
    super.initialize()
	}

	levelUp = () => {
    super.levelUp()
		this.addAsteroids(this.level * 3)
	}

	handleDestroyedShip() {
		this.lost()
	}

	detect() {
    super.detect()
		this.detectDestroyedShips()
    this.detectDestroyedObjects()
    this.detectAddBlackHoleReady()
    this.detectLevelChangeReady()
	}

}
