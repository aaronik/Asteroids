import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import GetMultiplayerGameId from '../components/getMultiId'
import { HEIGHT, WIDTH } from '../constants'
import gameManager from '../lib/gameManager'

export default function JoinMultiPlayerGame() {

  const [gameId, setGameId] = useState('')

  const onCanvas = (canvas: HTMLCanvasElement) => {
    gameManager.joinMultiPlayerGame(canvas, gameId)
  }

  const onGameId = (gameId: string) => {
    setGameId(gameId)
  }

  useEffect(() => {
    return () => {
      if (gameId) gameManager.clean()
    }
  }, [])

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
