import { network } from "../network"
import Ship from "./ship"
import Vector from "./vector"

type ReadoutOptions = {
  game: {
    level: number
    status?: string
    gameId?: string
    ships: { [shipId: string]: Ship }
  }
}

export default class Readout {
  game: ReadoutOptions['game']

  constructor(options: ReadoutOptions) {
    this.game = options.game
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { status, gameId, level, ships } = this.game

    const isMultiPlayer = !!this.game.status

    ctx.font = '15pt "Exo 2", sans-serif'
    ctx.fillStyle = 'white'

    const startHeight = 20
    const lineHeight = 35

    function* getNextHeight(): IterableIterator<number> {
      let currentHeight = startHeight

      while (true) {
        yield currentHeight
        currentHeight += lineHeight
      }
    }

    const nextHeight = getNextHeight()

    const addy = network.address.slice(0, 5) + '...'

    ctx.fillText('Level:  ' + level, 20, nextHeight.next().value)
    if (isMultiPlayer) ctx.fillText('Address:  ' + addy, 20, nextHeight.next().value)
    if (isMultiPlayer) ctx.fillText('Status:  ' + status, 20, nextHeight.next().value)
    if (isMultiPlayer) ctx.fillText('Game:  ' + gameId, 20, nextHeight.next().value)

    Object.values(ships).forEach((ship) => {
      const y = nextHeight.next().value
      var pos = new Vector([107, y - 5])
      var or = new Vector([0, -1])

      ctx.fillStyle = 'white'
      ctx.fillText('Health:        ' + ship.health, 20, y)
      ship.draw(ctx, pos, or)
    })
  }

}
