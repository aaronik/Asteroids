import type Network from '@browser-network/network'
import type { generateSecret as GenerateSecret } from '@browser-network/crypto'
import type Dbdb from '@browser-network/database'
import { AsteroidsMessage, MultiPlayerGameData } from './types'

const Net = require('@browser-network/network/umd/network').default as typeof Network
const { generateSecret } = require('@browser-network/crypto/umd/crypto') as { generateSecret: typeof GenerateSecret }
const Db = require('@browser-network/database/umd/dbdb').default as typeof Dbdb

export const network = new Net<AsteroidsMessage>({
  address: generateSecret(),
  networkId: 'asteroids-net-fahi374ry2i3uhddh',
  switchAddress: 'http://switchboard.aaronik.com'
  // switchAddress: 'http://localhost:5678'
})

// @ts-ignore
window.network = network

export const db = new Db<MultiPlayerGameData | null>({
  // @ts-ignore TODO it'd be nice if Dbdb didn't complain every time it had a different version of network
  // I want it to accept any kind of Network that's in its package.json
  network: network,
  secret: generateSecret(),
  appId: 'asteroids-dbdb'
})

// @ts-ignore
window.db = db

/**
* @description Return an id that's unique per game.
* Meant to be used to keep messages unique if there are multiple
* multiplayer games happening all at once.
*/
export const APP_ID = (game: { gameId: string }) => {
  return 'asteroids-' + game.gameId
}
