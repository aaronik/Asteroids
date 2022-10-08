import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import { HEIGHT, WIDTH } from '../constants'
import SinglePlayerGame from '../game/singlePlayerGame'

export default function SinglePlayerGameRoute() {

  const [game, setGame] = useState<SinglePlayerGame>()

  const onCanvas = (canvas: HTMLCanvasElement) => {
    setGame(new SinglePlayerGame(canvas))
  }

  useEffect(() => {
    return () => game?.teardown()
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
