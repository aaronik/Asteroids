import MultiPlayerGameHost from "./game/multiPlayerGameHost"
import Asteroid, { AsteroidOptions } from "./lib/asteroid"
import BlackHole, { BlackHoleOptions } from "./lib/blackHole"
import Bullet, { BulletOptions } from "./lib/bullet"
import Ship, { ShipOptions } from "./lib/ship"

export type AsteroidFullState = {
  type: 'asteroid'
} & ReturnType<Asteroid['getState']>

export type BlackHoleFullState = {
  type: 'blackHole'
} & ReturnType<BlackHole['getState']>

export type BulletFullState = {
  type: 'bullet'
} & ReturnType<Bullet['getState']>

export type LevelFullState = {
  type: 'level'
} & { level: number }

// Deliberately left out of FullStateObject, ship states
// are one thing the host is not in charge of
export type ShipFullState = {
  type: 'ship'
} & ReturnType<Ship['getState']>

export type FullStateObject =
  AsteroidFullState |
  BlackHoleFullState |
  BulletFullState |
  LevelFullState |
  ShipFullState


export type LateralDirection = 'left' | 'right'
export type VerticalDirection = 'up' | 'down'
export type Direction = LateralDirection | VerticalDirection

export type TurnOptions = {
  shipId: string
  dir: LateralDirection
  percentage: number
}

export type DampenOptions = {
  shipId: string
}

export type HitShipOptions = {
  shipId: string
  damage: number
}

export type GrowBlackHoleOptions = {
  id: string
  amt: number
}

export type AppId = string

export type AsteroidsMessage = { appId: AppId } & ({
  type: 'addAsteroid'
  data: AsteroidOptions
} | {
  type: 'addBlackHole'
  data: BlackHoleOptions
} | {
  type: 'growBlackHole'
  data: GrowBlackHoleOptions
} | {
  type: 'explodeAsteroid'
  data: string // asteroid id
} | {
  type: 'addShip'
  data: Omit<ShipOptions, 'addExhaustParticles'>
} | {
  type: 'fireShip'
  data: BulletOptions
} | {
  type: 'removeBullet'
  data: BulletOptions
} | {
  type: 'powerShip'
  data: string // ship id
} | {
  type: 'turnShip'
  data: TurnOptions
} | {
  type: 'dampenShip'
  data: DampenOptions
} | {
  type: 'setAction'
  data: {
    dir: Direction,
    shipId: string
  }
} | {
  type: 'unsetAction'
  data: {
    dir: Direction,
    shipId: string
  }
} | {
  type: 'hitShip'
  data: HitShipOptions
} | {
  type: 'guestLeaving'
  data: string // shipId
} | {
  type: 'levelUp'
} | {
  type: 'pause'
} | {
  type: 'shipState'
  data: ShipFullState
})

export type MultiPlayerGameData = {
  gameId: string,
  created: number,
  width: number,
  height: number,
  paused: boolean,
  level: number,
  objectState: ReturnType<MultiPlayerGameHost['getFullState']>
}



