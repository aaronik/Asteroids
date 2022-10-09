import type MultiPlayerGame from '../game/multiPlayerGame'
import type MultiPlayerGameHost from '../game/multiPlayerGameHost'
import type MultiPlayerGameGuest from '../game/multiPlayerGameGuest'
import Asteroid from './asteroid'
import { APP_ID, db, network } from '../network'
import { AsteroidsMessage } from '../types'
import { neverGonnaGiveYouUp } from '../util'
import { router } from '../App'
import type { Message } from '@browser-network/network'

const debugFlag = false
const debug = (...logs: any[]) => { if (debugFlag) console.log(...logs) }

// TODO Either this should be instantiable and made from game's constructor, or
// KeyListener should be floating around too and made Singleton.
export default class MultiPlayerListener {
  game: MultiPlayerGame

  constructor(game: MultiPlayerGame) {
    this.game = game
    this.startListening()
  }

  startListening() {
    db.onChange(this.onChange)
    network.on('message', this.onMessage)
    network.on('add-connection', () => this.updateGameStatus(this.game))
    network.on('destroy-connection', () => this.updateGameStatus(this.game))
  }

  stopListening() {
    db.removeChangeHandler(this.onChange)
    network.on('message', this.onMessage)
    network.removeListener('add-connection', this.updateGameStatus)
    network.removeListener('destroy-connection', this.updateGameStatus)
  }

  private onChange = () => {
    if (this.game.type !== 'guest') return

    console.log('db onchange handler from MultiPlayerListener!')

    const ourGame = db.getAll().find(wrapped => wrapped?.state?.gameId === this.game.gameId)

    // when host leaves
    if (!ourGame) {
      this.stopListening()
      router.navigate('/nohost')
    }

    if (ourGame?.state) (this.game as MultiPlayerGameGuest).handleFullStateUpdate(ourGame.state)
  }

  private updateGameStatus(game: MultiPlayerGame) {
    game.recalculateStatus()
  }

  private onMessage = (mes: Message & AsteroidsMessage) => {
    const game = this.game

    if (mes.appId !== APP_ID(game)) return
    const message = mes as AsteroidsMessage

    switch (message.type) {
      case 'addAsteroid':
        debug('received asteroid:')
        game.addAsteroid(message.data)
        break
      case 'addBlackHole':
        debug('received black hole')
        if (game.type === 'guest')
          game.foreignAddBlackHole(message.data)
        break
      case 'growBlackHole':
        debug('grow black hole')
        if (game.type === 'guest')
          game.foreignGrowBlackHole(message.data)
        break
      case 'explodeAsteroid':
        debug('explodeAsteroid')
        const asteroid = game.get(message.data) // asteroid id
        if (asteroid) game.explodeAsteroid(asteroid as Asteroid)
        break
      case 'addShip':
        debug('add foreign ship')
        game.addForeignShip(message.data) // ship opts
        break
      case 'fireShip':
        debug('firing foreign ship')
        game.fireForeignShip(message.data) // bullet opts
        break
      case 'removeBullet':
        debug('remove bullet')
        if (game.type === 'guest')
          game.foreignRemoveBullet(message.data) // bullet opts
        break
      case 'powerShip':
        debug('power foreign ship')
        game.setRepetativeAction(message.data, 'up')
        break
      case 'turnShip':
        debug('turn foreign ship')
        game.setRepetativeAction(message.data.shipId, message.data.dir)
        break
      case 'dampenShip':
        debug('dampen foreign ship')
        game.setRepetativeAction(message.data.shipId, 'down')
        break
      case 'hitShip':
        debug('hitShip')
        game.foreignHitShip(message.data) // opts
        break
      case 'levelUp':
        debug('foreign level up')
        game.levelUp()
        break
      case 'pause':
        debug('foreign pause')
        if (game.type === 'host') (game as MultiPlayerGameHost).foreignPause()
        break
      case 'shipState':
        debug('foreign shipState')
        game.handleForeignShipState(message.data)
        break
      case 'setAction':
        game.setRepetativeAction(message.data.shipId, message.data.dir)
        debug('setAction by anonha', message.data)
        break
      case 'unsetAction':
        game.unsetRepetativeAction(message.data.shipId, message.data.dir)
        debug('unsetAction by anonha', message.data)
        break
      case 'guestLeaving':
        game.handleDestroyedShip(game.ships[message.data])
        debug('unsetAction by anonha', message.data)
        break

      default: neverGonnaGiveYouUp(message)
    }
  }

}
