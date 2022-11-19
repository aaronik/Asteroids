import Game from "./game"
import Asteroid, { AsteroidOptions } from '../lib/asteroid'
import Ship, { ShipOptions } from "../lib/ship"
import Vector from "../lib/vector"
import BlackHole, { BlackHoleOptions } from "../lib/blackHole"
import Bullet, { BulletOptions } from "../lib/bullet"
import { APP_ID, network } from '../network'
import { GrowBlackHoleOptions, HitShipOptions, ShipFullState, Direction } from "../types"
import ExhaustParticle from "../lib/exhaustParticle"
import MultiPlayerListener from "../lib/multiplayerListener"

const SHIP_STATE_SEND_RATE = 30

// TODO:
// * When host dies, guest gets repeated +40
// * When guest joins paused game, they don't see asteroids until it's unpaused
export default class MultiPlayerGame extends Game {
  gameId: string
  multiPlayerListener: MultiPlayerListener
  type: 'host' | 'guest'
  handleDestroyedShip: (ship: Ship) => void

  constructor(gameId: string, canvasEl: HTMLCanvasElement) {
    super(canvasEl)
    this.gameId = gameId
    this.multiPlayerListener = new MultiPlayerListener(this)
    //this.ship assigned in addShip // TODO Why? Cleaning this up may clean up ships in general

    // TODO remove
    network.on('message', (mes) => {
      if (mes.appId !== APP_ID(this)) {
        console.count('received other app message: ' + mes.appId)
        console.groupCollapsed(mes)
        console.groupEnd()
        return
      }

      // const message = mes as AsteroidsMessage

      // mes.appId
      // message.appId
      // mes.type
      // message.type

      // console.group('receive')
      // console.log('RECEIVING:')
      // console.table(message)
      // console.groupEnd()
    })

    // network.on('broadcast-message', message => {
    //   if (message.appId !== APP_ID(this)) return
    //   console.log('broadcasting a:', message.type)
    //   // console.group('send')
    //   // console.log('BROADCASTING:')
    //   // console.table(message)
    //   // console.groupEnd()
    // })

  }

  teardown() {
    super.teardown()
    this.multiPlayerListener.stopListening()
  }

  // This game will never request asteroids, just get them from the host.
  addAsteroid(asteroidOpts: AsteroidOptions) {
    const asteroid = new Asteroid(asteroidOpts)
    this.asteroids[asteroid.id] = asteroid
    return asteroid
  }

  addAsteroids = (num: number) => {
    for (var i = 0; i < num; i++) {
      const randomAsteroid = Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT)
      randomAsteroid.vel = new Vector([0, 0])
      this.addAsteroid(randomAsteroid)
    }
  }

  setRepetativeAction(shipId: string, dir: Direction): void {
    const didAction = super.setRepetativeAction(shipId, dir)
    if (didAction === false) return

    network.broadcast({
      type: 'setAction',
      data: { dir, shipId },
      appId: APP_ID(this)
    })
  }

  unsetRepetativeAction(shipId: string, dir: Direction): void {
    const didUnset = super.unsetRepetativeAction(shipId, dir)
    if (didUnset === false) return

    network.broadcast({
      type: 'unsetAction',
      data: { dir, shipId },
      appId: APP_ID(this)
    })
  }

  addShip() {
    const ship = super.addShip()

    const rawShipOpts = ship.getState()

    // Network will stringify this anyways so it doesn't
    // actually matter, but best to do it right for now in case network
    // fixes that ever :)
    const shipOpts = {
      ...rawShipOpts,
      pos: new Vector(rawShipOpts.pos),
      vel: new Vector(rawShipOpts.vel),
      orientation: new Vector(rawShipOpts.orientation)
    }

    network.broadcast({
      type: 'addShip',
      appId: APP_ID(this),
      data: shipOpts
    })


    return ship
  }

  addForeignShip(shipOpts: Omit<ShipOptions, 'addExhaustParticles'>) {
    const opts = {
      ...shipOpts,
      addExhaustParticles: (ps: ExhaustParticle[]) => {
        ps.forEach(p => {
          this.exhaustParticles[p.id] = p
        })
      }
    }
    const ship = new Ship(opts)
    this.ships[ship.id] = ship
    this.addReadout()
  }

  foreignAddBlackHole(bhOpts: BlackHoleOptions) {
    this.addBlackHole(bhOpts)
  }

  foreignGrowBlackHole(amtOpts: GrowBlackHoleOptions) {
    const blackHole = this.get(amtOpts.id)
    const amt = amtOpts.amt
    this.growBlackHole(blackHole as BlackHole, amt)
  }

  fireForeignShip(bulletOpts: BulletOptions) {
    const ship = this.get(bulletOpts.ship.id) as Ship
    const bullet = ship.fire(bulletOpts)
    this.bullets[bullet.id] = bullet
  }

  fireShip() {
    const bullet = super.fireShip()

    const rawBulletOpts = bullet.getState()

    const bulletOpts = {
      ...rawBulletOpts,
      pos: new Vector(rawBulletOpts.pos),
      vel: new Vector(rawBulletOpts.vel),
      orientation: new Vector(rawBulletOpts.orientation),
      ship: this.ships[this.shipId]
    }

    network.broadcast({
      type: 'fireShip',
      appId: APP_ID(this),
      data: bulletOpts
    })

    return bullet
  }

  foreignRemoveBullet(bulletOpts: BulletOptions) {
    const id = bulletOpts.id as string
    const bullet = this.get(id) as Bullet
    this.removeBullet(bullet)
  }

  // TODO OOooo I think this is an earlier attempt at ship vs ship
  foreignHitShip(opts: HitShipOptions) {
    const ship = this.get(opts.shipId) as Ship
    const damage = opts.damage
    ship.health -= damage
  }

  clearState() {
    this.asteroids = {}
    // this.bullets = {}
    // this.ships = { [this.ship.id]: this.ship }
    this.blackHoles = {}
  }

  sendShipState() {
    if (!this.ships[this.shipId]) return // ex. when the host is dead
    network.broadcast({
      type: 'shipState',
      data: this.ships[this.shipId].getState(),
      appId: APP_ID(this)
    })
  }

  handleForeignShipState(stateObj: ShipFullState) {
    const shipState = {
      ...stateObj,
      pos: new Vector(stateObj.pos),
      vel: new Vector(stateObj.vel),
      orientation: new Vector(stateObj.orientation),
      addExhaustParticles: (ps: ExhaustParticle[]) => {
        ps.forEach(p => {
          this.exhaustParticles[p.id] = p
        })
      }

    }

    if (shipState.id !== this.shipId) {
      const ship = new Ship(shipState)
      this.ships[ship.id] = ship
    }
  }

  detectSendShipStateReady() {
    if (this._counter % SHIP_STATE_SEND_RATE === 0) this.sendShipState()
  }

  detect() {
    super.detect()
    this.detectSendShipStateReady()
  }

}

