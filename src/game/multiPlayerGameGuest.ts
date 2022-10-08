import MultiPlayerGame from "./multiPlayerGame"
import Asteroid from '../lib/asteroid'
import Ship from "../lib/ship"
import Vector from "../lib/vector"
import BlackHole from "../lib/blackHole"
import Bullet from "../lib/bullet"
import { AsteroidFullState, BlackHoleFullState, BulletFullState, FullStateObject, MultiPlayerGameData, ShipFullState } from "../types"
import { APP_ID, network } from "../network"
import { neverGonnaGiveYouUp } from "../util"
import ExhaustParticle from "../lib/exhaustParticle"

export default class MultiPlayerGameGuest extends MultiPlayerGame {

  constructor(gameId: string, canvasEl: HTMLCanvasElement) {
    super(gameId, canvasEl)
    this.type = 'guest'
  }

  handleFullStateUpdate(data: MultiPlayerGameData) {
    this.handleFullState(data.objectState)

    this.level = data.level

    if (data.paused && !this.isPaused()) {
      this.setPaused()
    } else if (!data.paused && this.isPaused()) {
      this.setUnpaused()
    }
  }

  handleFullState(fullStateArray: FullStateObject[]) {
    this.clearState()

    fullStateArray.forEach(stateObj => {
      switch (stateObj.type) {
        case 'asteroid':
          this.handleFullStateAsteroid(stateObj)
          break
        case 'blackHole':
          this.handleFullStateBlackHole(stateObj)
          break
        case 'bullet':
          this.handleFullStateBullet(stateObj)
          break
        case 'ship':
          this.handleFullStateShip(stateObj)
          break
        case 'level':
          break
        default: neverGonnaGiveYouUp(stateObj)
      }
    })
  }

  handleFullStateAsteroid(stateObj: AsteroidFullState) {
    const state = {
      ...stateObj,
      pos: new Vector(stateObj.pos),
      vel: new Vector(stateObj.vel),
      orientation: new Vector(stateObj.orientation),
    }

    this.asteroids.push(new Asteroid(state))
  }

  handleFullStateBlackHole(stateObj: BlackHoleFullState) {
    const state = {
      ...stateObj,
      pos: new Vector(stateObj.pos),
      vel: new Vector(stateObj.vel),
    }

    this.blackHoles.push(new BlackHole(state))
  }

  handleFullStateBullet(stateObj: BulletFullState) {
    const state = {
      ...stateObj,
      pos: new Vector(stateObj.pos),
      vel: new Vector(stateObj.vel),
      orientation: new Vector(stateObj.orientation),
      ship: this.get(stateObj.shipId) as Ship
    }

    this.bullets.push(new Bullet(state))
  }

  handleFullStateShip(ship: ShipFullState) {
    if (ship.id === this.ship.id) return // we don't want the host to update our ship

    const opts = {
      ...ship,
      pos: new Vector(ship.pos),
      vel: new Vector(ship.vel),
      orientation: new Vector(ship.orientation),
      addExhaustParticles: (ps: ExhaustParticle[]) => this.exhaustParticles.push(...ps)
    }
    this.ships[ship.id] = new Ship(opts)
  }

  // On a press 'p'
  pause() {
    network.broadcast({
      type: 'pause',
      appId: APP_ID(this),
    })
  }
}
