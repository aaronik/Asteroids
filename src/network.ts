import type Network from '@browser-network/network'
import type { generateSecret as GenerateSecret } from '@browser-network/crypto'
import type Db from '@browser-network/database'
import { AsteroidsMessage, MultiPlayerGameData } from './types'

const Net = require('@browser-network/network/umd/network').default as typeof Network
const { generateSecret } = require('@browser-network/crypto/umd/crypto') as { generateSecret: typeof GenerateSecret }
const Database = require('@browser-network/database/umd/db').default as typeof Db

export const network = new Net<AsteroidsMessage>({
  address: generateSecret(),
  networkId: 'asteroids-net-fahi374ry2i3uhddh',
  switchAddress: 'https://switchboard.aaronik.com'
  // switchAddress: 'http://localhost:5678'
})

// @ts-ignore
window.network = network

// network.on('connection-process', console.log)

export const db = new Database<MultiPlayerGameData | null>({
  // @ts-ignore TODO it'd be nice if Db didn't complain every time it had a different version of network
  // I want it to accept any kind of Network that's in its package.json
  network: network,
  secret: generateSecret(),
  appId: 'asteroids-db'
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

window.addEventListener('beforeunload', () => {
  db.clear() // These are meant to be ephemeral, this helps keep it clean
})
