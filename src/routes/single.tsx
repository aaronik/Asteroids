import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import SinglePlayerGame from '../game/singlePlayerGame'
import { getWindowHeight, getWindowWidth } from '../util'

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
        height={getWindowHeight()}
        width={getWindowWidth()}
        onCanvas={onCanvas}
      />
    </div>
  )
}
