import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import GetMultiPlayerGameId from '../components/getMultiId'
import { HEIGHT, WIDTH } from '../constants'
import MultiPlayerGameGuest from '../game/multiPlayerGameGuest'
import { APP_ID, network } from '../network'

// TODO Get the HEIGHT/WIDTH from the game host and use those dimensions
/**
* @description This is kind of a weird one, it presents two different screens
* based on its state. if a game hasn't been selected, a selection screen,
* otherwise, the game itself, as a guest. The reason for this was because I
* wanted a refresh of the browser to not drop the person back into the same
* game. TBH I think this was mostly for testing sake, now that I think about it.
* If refreshing could land someone in the same game, then we could get rid of
* GetMultiPlayerGameId entirely and just have a dedicated selection screen
* at its own URL.
*/
export default function JoinMultiPlayerGame() {

  const [gameId, setGameId] = useState('')
  const [game, setGame] = useState<MultiPlayerGameGuest>()

  const onCanvas = (canvas: HTMLCanvasElement) => {
    const g = new MultiPlayerGameGuest(gameId, canvas)
    setGame(g)
  }

  const onGameId = (gameId: string) => {
    setGameId(gameId)
  }

  useEffect(() => {
    return () => {
      if (!gameId || !game) return
      game.teardown()

      network.broadcast({
        type: 'guestLeaving',
        data: game?.shipId,
        appId: APP_ID(game)
      })
    }
  }, [gameId, game])

  if (!gameId) return (
    <GetMultiPlayerGameId onGameId={onGameId} />
  )

  return (
    <div id='main-wrapper'>
      <Canvas
        height={HEIGHT}
        width={WIDTH}
        onCanvas={onCanvas}
      />
    </div>
  )
}
