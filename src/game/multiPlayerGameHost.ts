import MultiPlayerGame from "./multiPlayerGame"
import Asteroid, { AsteroidOptions } from '../lib/asteroid'
import Ship from "../lib/ship"
import BlackHole, { BlackHoleOptions } from "../lib/blackHole"
import Bullet from "../lib/bullet"
import { APP_ID, db, network } from '../network'
import { router } from "../App"

const SEND_FULL_STATE_RATE: number = 30

// TODO Handle when a host leaves or dies.. or when anybody leaves

export default class MultiPlayerGameHost extends MultiPlayerGame {

  constructor(gameId: string, canvasEl: HTMLCanvasElement) {
    super(gameId, canvasEl)
    this.type = 'host'

    // This registers ourselves as being an active game on the network as well
    this.sendFullState()
  }

  initialize() {
    this.addAsteroids(this.level)
    super.initialize()
  }

  addAsteroid(asteroidOpts: AsteroidOptions) {
    const asteroid = super.addAsteroid(asteroidOpts)

    network.broadcast({
      type: 'addAsteroid',
      data: asteroid,
      appId: APP_ID(this)
    })

    return asteroid
  }

  addBlackHole(bhOpts?: BlackHoleOptions | undefined) {
    const blackHole = super.addBlackHole(bhOpts)

    network.broadcast({
      type: 'addBlackHole',
      data: blackHole,
      appId: APP_ID(this)
    })

    return blackHole
  }

  growBlackHole(blackHole: BlackHole, amt: number): void {
    super.growBlackHole(blackHole, amt)
    network.broadcast({
      type: 'growBlackHole',
      data: { id: blackHole.id, amt },
      appId: APP_ID(this)
    })
  }

  // TODO: Here we're including bullets in what the host
  // controls but in getFullState we're not including them
  removeBullet(bullet: Bullet) {
    super.removeBullet(bullet)

    network.broadcast({
      type: 'removeBullet',
      data: bullet,
      appId: APP_ID(this)
    })
  }

  levelUp() {
    super.levelUp()
    this.addAsteroids(this.level)
    network.broadcast({
      type: 'levelUp',
      appId: APP_ID(this)
    })
  }

  explodeAsteroid(asteroid: Asteroid) {
    super.explodeAsteroid(asteroid)

    network.broadcast({
      type: 'explodeAsteroid',
      data: asteroid.id,
      appId: APP_ID(this)
    })
  }

  handleDestroyedShip(ship: Ship) {
    delete this.ships[ship.id]
    if (this.ship.id === ship.id) {
      this.announce('You\'ve lost!')

      if (Object.keys(this.ships).length === 0) {
        return router.navigate('/lost')
      }

      this.announce('Don\'t leave!')
      this.announce('You\'re the host!')
    } else {
      this.announce('+ 40!!')
      this.ship.health += 40
    }
  }

  detectSendState() {
    if (this._counter % SEND_FULL_STATE_RATE === 0) this.sendFullState()
  }

  detect() {
    super.detect()
    this.detectDestroyedObjects()
    this.detectAddBlackHoleReady()
    this.detectLevelChangeReady()
    this.detectSendState()
  }

  // Create a multiplayer game that the other users can see
  sendFullState() {
    db.set({
      gameId: this.gameId,
      created: Date.now(),
      width: this.WIDTH,
      height: this.HEIGHT,
      paused: this.isPaused(),
      level: this.level,
      objectState: this.getFullState()
    })
  }

  getFullState() {
    var objs = this.wrappableMovingObjects()
    var states = objs.map((obj) => {
      return obj.getState()
    })

    var levelObj = {
      type: 'level',
      level: this.level
    }

    states.push(levelObj)

    return states
  }

  pause() {
    super.pause()

    // Purely for the paused here
    this.sendFullState()
  }

  /**
  * @description The host has the state of pause-ness. If any guest wants
  * to pause, they essentially tell the host, and the host sets it via db.
  * Once that's set, all the other guests pick that up and pause. The guest
  * who called pause in the first place may be able to have an immediate pause
  * for good effect.
  */
  foreignPause() {
    this.pause()
  }

}
