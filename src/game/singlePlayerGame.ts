import Game from './game'

export default class SinglePlayerGame extends Game {

	initialize() {
		this.addAsteroids(this.level)
    super.initialize()
	}

	levelUp = () => {
    super.levelUp()
		this.addAsteroids(this.level)
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
