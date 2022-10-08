import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import GetMultiplayerGameId from '../components/getMultiId'
import { HEIGHT, WIDTH } from '../constants'
import MultiPlayerGameGuest from '../game/multiPlayerGameGuest'

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
      if (!gameId) return
      game?.teardown()
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
