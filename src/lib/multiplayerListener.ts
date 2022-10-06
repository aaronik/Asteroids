import MultiplayerGameHost from '../game/multiplayerGameHost'
import MultiPlayerGameGuest from '../game/multiplayerGameGuest'
import Asteroid from './asteroid'
import { APP_ID, db, network } from '../network'
import { AsteroidsMessage } from '../types'
import MultiPlayerGameHost from '../game/multiplayerGameHost'
import { neverGonnaGiveYouUp } from '../util'

type MultiplayerGame = MultiplayerGameHost | MultiPlayerGameGuest

// TODO Introduce teardown functionality here too
export default class MultiplayerListener {
  static startListening(game: MultiplayerGame) {
    var debugFlag = false

    const debug = (...logs: any[]) => { if (debugFlag) console.log(...logs) }

    if (game instanceof MultiPlayerGameGuest) {
      // TODO unsubscribe fro this on game teardown
      // TODO Here can handle when host leaves
      db.onChange(() => {
        const ourGame = db.getAll().find(wrapped => wrapped?.state?.gameId === game.gameId)
        if (ourGame?.state) game.handleFullStateUpdate(ourGame.state)
      })
    }

    const updateGameStatus = (game: MultiplayerGame) => game.recalculateStatus()
    network.on('add-connection', () => updateGameStatus(game))
    network.on('destroy-connection', () => updateGameStatus(game))

    network.on('message', (mes) => {
      if (mes.appId !== APP_ID(game)) return
      const message = mes as AsteroidsMessage

      switch (message.type) {
        case 'addAsteroid':
          debug('received asteroid:')
          game.addAsteroid(message.data)
          break
        case 'addBlackHole':
          debug('received black hole')
          if (game instanceof MultiPlayerGameGuest)
            game.foreignAddBlackHole(message.data)
          break
        case 'growBlackHole':
          debug('grow black hole')
          if (game instanceof MultiPlayerGameGuest)
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
          if (game instanceof MultiPlayerGameGuest)
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
        case 'destroyedShip':
          debug('destroyedShip')
          game.foreignDestroyedShip(message.data) // shipId
          break
        case 'levelUp':
          debug('foreign level up')
          game.levelUp()
          break
        case 'pause':
          debug('foreign pause')
          if (game instanceof MultiPlayerGameHost) game.foreignPause()
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

        default: neverGonnaGiveYouUp(message)
      }
    })

  }

}
