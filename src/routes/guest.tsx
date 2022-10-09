import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import GetMultiplayerGameId from '../components/getMultiId'
import { HEIGHT, WIDTH } from '../constants'
import MultiPlayerGameGuest from '../game/multiPlayerGameGuest'
import { APP_ID, network } from '../network'

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
        data: game?.ship.id,
        appId: APP_ID(game)
      })
    }
  }, [gameId, game])

  if (!gameId) return (
    <GetMultiplayerGameId onGameId={onGameId} />
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
