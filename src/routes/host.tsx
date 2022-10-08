import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import { HEIGHT, WIDTH } from '../constants'
import MultiPlayerGameHost from '../game/multiPlayerGameHost'
import { db } from '../network'

export default function HostMultiPlayerGame() {

  const [game, setGame] = useState<MultiPlayerGameHost>()

  const onCanvas = (canvas: HTMLCanvasElement) => {
    const gameId = crypto.randomUUID().slice(-5) // Take just the last 5 chars
    const g = new MultiPlayerGameHost(gameId, canvas)
    setGame(g)
  }

  useEffect(() => {
    // Cleaner function to remove game from db when we leave this page
    return () => {
      game?.teardown()
      db.set(null)
    }
  }, [game])

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
