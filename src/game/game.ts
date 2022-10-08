import ExhaustParticle from "../lib/exhaustParticle"
import CustomArray from '../lib/array'
import Readout from '../lib/readout'
import ExplodingText from '../lib/explodingText'
import Background from '../lib/background'
import BlackHole, { BlackHoleOptions } from '../lib/blackHole'
import Star from '../lib/star'
import Visuals from '../lib/visuals'
import Ship from "../lib/ship"
import Asteroid, { AsteroidOptions } from "../lib/asteroid"
import Bullet from "../lib/bullet"
import MovingObject from "../lib/movingObject"
import Vector from "../lib/vector"
import KeyListener from "../lib/keyListener"
import { Direction } from "../types"
import { isAnyCombinationOf } from "../util"
import MassiveObject from "../lib/massiveObject"
import { router } from "../App"

export default abstract class Game {
  FPS = 30
  DIFFICULTY_INCREASE_RATE = 1.5
  BLACK_HOLE_DELAY = 20 // seconds

  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  readout: Readout
  background: Background
  ship: Ship
  ships: {
    [shipId: string]: Ship
  } = {}
  exhaustParticles: CustomArray<ExhaustParticle> = new CustomArray()
  explodingTexts: CustomArray<ExplodingText> = new CustomArray()
  asteroids: CustomArray<Asteroid> = new CustomArray()
  noExplodeAsteroids: CustomArray<Asteroid> = new CustomArray()
  bullets: CustomArray<Bullet> = new CustomArray()
  blackHoles: CustomArray<BlackHole> = new CustomArray()
  level: number = 1
  _counter: number = 1 // tics since last levelUp
  asteroidKills: number = 1
  WIDTH: number // in px
  HEIGHT: number // in px
  mainTimer?: string | number | NodeJS.Timeout
  keyListener: KeyListener
  abstract handleDestroyedShip(ship: Ship): void

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = canvasEl
    this.WIDTH = canvasEl.width
    this.HEIGHT = canvasEl.height
    this.ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D

    // @ts-ignore
    window.game = this

    this.initialize()
  }

  initialize() {
    this.addShip()
    this.addReadout()
    this.addBackground()
    this.keyListener = new KeyListener(this)
    this.start()
    this.announce('Welcome!')
  }

  /**
  * @description perform all the things required to make the game go away
  */
  teardown() {
    this.stop()
    this.keyListener.stopListening()
  }

  addReadout() {
    const options = {
      game: this
    }

    this.readout = new Readout(options)
  }

  addBackground() {
    this.background = new Background(this)
  }

  addShip() {
    const ship = new Ship({
      pos: new Vector([this.WIDTH / 2, this.HEIGHT / 2]),
      addExhaustParticles: (particles: ExhaustParticle[]) => this.exhaustParticles.push(...particles)
    })
    this.ship = ship
    this.ships[ship.id] = ship
    return ship
  }

  // This game will never request asteroids, just get them from the host.
  addAsteroid(asteroidOpts: AsteroidOptions) {
    const asteroid = new Asteroid(asteroidOpts)
    this.asteroids.push(asteroid)
    return asteroid
  }

  addAsteroids(num: number) {
    for (var i = 0; i < num; i++) {
      const randomAsteroid = Asteroid.randomAsteroid(this.WIDTH, this.HEIGHT)
      this.addAsteroid(randomAsteroid)
    }
  }

  addBlackHole(bhOpts?: BlackHoleOptions): BlackHole {
    const bh = new BlackHole(bhOpts)
    this.blackHoles.push(bh)
    this.announce('black hole')
    return bh
  }


  setRepetativeAction(shipId: string, dir: Direction): false | void {
    if (this.ships[shipId].actions[dir]) return false
    this.ships[shipId].setAction(dir)
  }

  unsetRepetativeAction(shipId: string, dir: Direction): false | void {
    if (!this.ships[shipId].actions[dir]) return false
    this.ships[shipId].unsetAction(dir)
  }

  fireShip() {
    const bullet = this.ship.fire()
    this.bullets.push(bullet)
    return bullet
  }

  levelUp() {
    this.level += 1
    this._counter = 0
    this.announce('Level ' + this.level)

    this.blackHoles = new CustomArray<BlackHole>()

    this.ship.health += 100
    this.announce('+100 health')
  }

  lost() {
    this.stop()
    this.announce('You\'ve lost.', true, () => {
      router.navigate('/lost')
    })
  }

  draw() {
    const game = this

    // clear the canvas
    this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT)

    // background
    this.background.draw(this.ctx)

    // ship exhaust particles
    this.exhaustParticles.forEach(ep => {
      ep.draw(game.ctx, this.WIDTH, this.HEIGHT)
    })

    // bullets
    this.bullets.forEach(function(bullet) {
      bullet.draw(game.ctx)
    })

    // ship
    { // -- rigamorole so our ship is drawn on top of others, unless we've lost
      let ourShip: Ship
      Object.values(this.ships).forEach(ship => {
        if (ship.id === this.ship.id) {
          ourShip = ship
        } else {
          ship.draw(game.ctx)
        }
        ourShip?.draw(game.ctx)
      })
    }

    // asteroids
    this.asteroids.forEach(function(asteroid) {
      asteroid.draw(game.ctx)
    })

    // back hole
    this.blackHoles.forEach(function(blackHole) {
      blackHole.draw(game.ctx, game.WIDTH, game.HEIGHT)
    })

    // readout text
    this.readout.draw(this.ctx)

    // exploding texts
    this.explodingTexts[0]?.draw(this.ctx)
  }

  gravitate() {
    // We want to leave out no collide asteroids so they'll actually
    // depart from each other
    const noCollideList = this.noExplodeAsteroids.reduce((list, asteroid) => {
      list[asteroid.id] = true
      return list
    }, {} as { [id: string]: true })

    this.massiveObjects().forEach(o1 => {
      this.massiveObjects().forEach(o2 => {
        if (o1.id === o2.id || (noCollideList[o1.id] && noCollideList[o2.id])) return
        o1.gravitate(o2)
      })
    })
  }

  move() {
    this.movingObjects().forEach(o => o.move())
    this.background.move()
  }

  announce(txt: string, independentTimer: boolean = false, onComplete?: () => void) {
    const explodingTextOptions = {
      txt, independentTimer, onComplete,
      game: this
    }

    this.explodingTexts.push(new ExplodingText(explodingTextOptions))
  }

  /**
   * Removes these from the world. So anything that wraps shouldn't be here.
   */
  clearNonWrappingOOBObjects() {
    this.clearOOBBullets()
    this.clearOOBExhaustParticles()
  }

  clearOOBExhaustParticles() {
    for (let i = 0; i < this.exhaustParticles.length; i++) {
      const ep = this.exhaustParticles[i]
      const posX = ep.pos[0]
      const posY = ep.pos[1]

      if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
        this.exhaustParticles.splice(i, 1)
      }
    }
  }

  removeBullet(bullet: Bullet) {
    this.bullets.remove(bullet)
  }

  handleExplodedText(txt: ExplodingText) {
    this.explodingTexts.remove(txt)
    txt.onComplete?.()
  }

  handleStarBlackHoleCollisions(star: Star) {
    star.die()
  }

  handleExhaustParticleBlackHoleCollision(ep: ExhaustParticle) {
    this.exhaustParticles.remove(ep)
  }

  handleShipAsteroidCollision(ship: Ship, asteroid: Asteroid) {
    this.explodeAsteroid(asteroid)
    Visuals.hit(this.canvas)
    ship.health -= asteroid.radius
  }

  handleShipBulletCollisions(ship: Ship, bullet: Bullet) {
    if (ship.id === bullet.ship.id) return // No friendly fire
    ship.health -= bullet.damage
    this.bullets.remove(bullet)
  }

  getMovingObjects() {
    return [
      ...Object.values(this.ships),
      ...this.asteroids,
      ...this.bullets,
      ...this.exhaustParticles,
      ...this.blackHoles,
    ]
  }

  getCollidedObjects() {
    const all = this.getMovingObjects()
    const collisions: [MovingObject, MovingObject][] = []

    while (all.length > 0) {
      const subject = all.shift() as (typeof all)[0] // Defeating the undefined, we know it's there.
      all.forEach(object => {
        if (subject.isCollidedWith(object)) {
          collisions.push([subject, object])
        }
      })
    }

    return collisions
  }

  detectDestroyedShips() {
    Object.values(this.ships).forEach(ship => {
      if (ship.health <= 0) {
        this.handleDestroyedShip(ship)
      }
    })
  }

  detectLevelChangeReady() {
    if (this.asteroids.length === 0) {
      this.levelUp()
    }
  }

  detectAddBlackHoleReady() {
    const ticsUntilBlackHole = (this.BLACK_HOLE_DELAY * 1000) / this.FPS
    if (this._counter >= ticsUntilBlackHole && !this.blackHoles.length) {
      this.addBlackHole()
    }
  }

  detectExplodedTexts() {
    var game = this

    this.explodingTexts.forEach(function(txt) {
      if (txt.alpha <= 0) {
        game.handleExplodedText(txt)
      }
    })
  }

  detectDestroyedObjects() {
    this.asteroids.forEach((asteroid) => {
      if (asteroid.health <= 0) {
        this.explodeAsteroid(asteroid)
      }
    })

    for (let i = 0; i < this.exhaustParticles.length; i++) {
      if (this.exhaustParticles[i].health <= 0) {
        this.exhaustParticles.splice(i, 1)
      }
    }
  }

  detect() {
    this.detectExplodedTexts()
    this.detectDestroyedShips()

    // TODO we can get rid of all the handle functions in here too by inlining these
    // ops. I think it'll be cleaner. Maybe could have a helper function to get the
    // right types cleanly
    this.getCollidedObjects().forEach(collision => {
      if (collision[0].isCollidedWith(collision[1])) {
        switch (true) {
          case isAnyCombinationOf(collision, Asteroid, Asteroid): {
            this.handleCollidingAsteroids(...collision as [Asteroid, Asteroid])
            break;
          }
          case isAnyCombinationOf(collision, Asteroid, BlackHole): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Asteroid) this.handleAsteroidBlackHoleCollision(obj1, obj2 as BlackHole)
            if (obj2 instanceof Asteroid) this.handleAsteroidBlackHoleCollision(obj2, obj1 as BlackHole)
            break;
          }
          case isAnyCombinationOf(collision, Asteroid, Bullet): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Asteroid) this.handleAsteroidBulletCollision(obj1, obj2 as Bullet)
            if (obj2 instanceof Asteroid) this.handleAsteroidBulletCollision(obj2, obj1 as Bullet)
            break;
          }
          case isAnyCombinationOf(collision, Asteroid, Ship): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Ship) this.handleShipAsteroidCollision(obj1, obj2 as Asteroid)
            if (obj2 instanceof Ship) this.handleShipAsteroidCollision(obj2, obj1 as Asteroid)
            break;
          }
          case isAnyCombinationOf(collision, BlackHole, Star): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Star) this.handleStarBlackHoleCollisions(obj1)
            if (obj2 instanceof Star) this.handleStarBlackHoleCollisions(obj2)
            break;
          }
          case isAnyCombinationOf(collision, BlackHole, Ship): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Ship) this.handleShipBlackHoleCollisions(obj1, obj2 as BlackHole)
            if (obj2 instanceof Ship) this.handleShipBlackHoleCollisions(obj2, obj1 as BlackHole)
            break;
          }
          case isAnyCombinationOf(collision, BlackHole, Bullet): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Bullet) this.handleBulletBlackHoleCollisions(obj1, obj2 as BlackHole)
            if (obj2 instanceof Bullet) this.handleBulletBlackHoleCollisions(obj2, obj1 as BlackHole)
            break;
          }
          case isAnyCombinationOf(collision, Ship, Bullet): {
            const [obj1, obj2] = collision
            if (obj1 instanceof Ship) this.handleShipBulletCollisions(obj1, obj2 as Bullet)
            if (obj2 instanceof Ship) this.handleShipBulletCollisions(obj2, obj1 as Bullet)
            break;
          }
        }

      }
    })
  }

  clearOOBAsteroids() { // substituted for wrap around
    let posX
    let posY
    let as

    for (let i = 0; i < this.asteroids.length; i++) {
      as = this.asteroids[i]

      posX = as.pos[0]
      posY = as.pos[1]

      if ((posX - as.radius > this.WIDTH || posX + as.radius < 0) ||
        (posY - as.radius > this.HEIGHT || posY + as.radius < 0)) {
        this.asteroids.splice(i, 1)
        this.addAsteroids(1)
      }
    }
  }

  clearOOBBullets() {
    let bullet
    let posX
    let posY

    for (let i = 0; i < this.bullets.length; i++) {
      bullet = this.bullets[i]
      posX = bullet.pos[0]
      posY = bullet.pos[1]

      if (posX < 0 || posY < 0 || posX > this.WIDTH || posY > this.HEIGHT) {
        this.bullets.splice(i, 1)
      }
    }
  }

  movingObjects(): CustomArray<MovingObject> {
    return new CustomArray<MovingObject>(
      ...Object.values(this.ships),
      ...this.asteroids,
      ...this.blackHoles,
      ...this.bullets,
      ...this.exhaustParticles,
    )
  }

  massiveObjects(): CustomArray<MassiveObject> {
    return new CustomArray<MassiveObject>(
      ...Object.values(this.ships),
      ...this.asteroids,
      ...this.blackHoles,
      ...this.bullets,
    )
  }

  wrappableMovingObjects() {
    return new CustomArray<MovingObject>(
      ...this.asteroids,
      ...Object.values(this.ships),
      ...this.blackHoles
    )
  }

  // from one side of the screen to the other
  wrapWrappableObjects() {
    const game = this

    const objects = this.wrappableMovingObjects()

    objects.forEach(function(object) {
      if ((object.pos[0] + object.radius) < 0) {
        object.pos[0] += (game.WIDTH + 2 * object.radius)
      }

      if ((object.pos[1] + object.radius) < 0) {
        object.pos[1] += (game.HEIGHT + 2 * object.radius)
      }

      if ((object.pos[0] - object.radius) > game.WIDTH) {
        object.pos[0] -= (game.WIDTH + 2 * object.radius)
      }

      if ((object.pos[1] - object.radius) > game.HEIGHT) {
        object.pos[1] -= (game.HEIGHT + 2 * object.radius)
      }
    })
  }

  depopulateNoExplodeAsteroids() {
    const game = this

    this.noExplodeAsteroids.forEach(function(as1) {
      const alone = game.noExplodeAsteroids.every(function(as2) {
        if (as1 === as2) {
          return true
        }

        return !as1.isCollidedWith(as2)
      })

      if (alone) {
        game.noExplodeAsteroids.remove(as1)
      }
    })
  }

  explodeAsteroid(asteroid: Asteroid) {
    this.asteroids.remove(asteroid)
    const newAsteroidsOptions = asteroid.explode()
    const newAsteroids = newAsteroidsOptions.map(op => new Asteroid(op))
    this.noExplodeAsteroids = new CustomArray(...this.noExplodeAsteroids.concat(newAsteroids))
    this.asteroids = new CustomArray(...this.asteroids.concat(newAsteroids))
  }

  growBlackHole(blackHole: BlackHole, amt: number) {
    blackHole.grow(amt)
  }

  handleBulletHits(bullet: Bullet) {
    this.removeBullet(bullet)
  }

  handleCollidingAsteroids(as1: Asteroid, as2: Asteroid) {
    const as1Clear = !this.noExplodeAsteroids.includes(as1)
    const as2Clear = !this.noExplodeAsteroids.includes(as2)
    if (as1Clear) as1.health -= as2.radius
    if (as2Clear) as2.health -= as1.radius
  }

  handleAsteroidBulletCollision(as: Asteroid, bullet: Bullet) {
    as.health -= bullet.damage
    this.removeBullet(bullet)
    this.ticAsteroidKills()
  }

  handleShipBlackHoleCollisions(ship: Ship, bh: BlackHole) {
    ship.health -= bh.mass
    this.growBlackHole(bh, ship.radius)
  }

  handleBulletBlackHoleCollisions(bullet: Bullet, blackHole: BlackHole) {
    this.removeBullet(bullet)
    this.growBlackHole(blackHole, bullet.radius * 10)
  }

  handleAsteroidBlackHoleCollision(as: Asteroid, blackHole: BlackHole) {
    as.health -= blackHole.radius
    this.growBlackHole(blackHole, as.radius)
  }

  get(id: string) {
    return this.movingObjects().find(obj => obj.id === id)
  }

  tic() {
    this._counter += 1
  }

  ticAsteroidKills() {
    this.asteroidKills += 1
  }

  step() {
    this.clearNonWrappingOOBObjects()
    this.depopulateNoExplodeAsteroids()
    this.wrapWrappableObjects()
    this.detect()
    this.move()
    this.gravitate()
    Object.values(this.ships).forEach(ship => ship.step())
    this.blackHoles.forEach(bh => bh.step())
    this.draw()
    this.tic()
  }

  stop() {
    console.log('game.stop from game')
    clearInterval(this.mainTimer)
    delete this.mainTimer
  }

  start() {
    if (this.mainTimer) throw new Error('Game already started!')
    const step = this.step.bind(this)
    this.mainTimer = setInterval(step, this.FPS)
  }

  pause() {
    if (this.isPaused()) this.setUnpaused()
    else this.setPaused()
  }

  isPaused() {
    return !this.mainTimer
  }

  setPaused() {
    this.stop()
    this.announce('Pause', true)
  }

  setUnpaused() {
    this.start()
    this.announce('Resume')
  }

}
