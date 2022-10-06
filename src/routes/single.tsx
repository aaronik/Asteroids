import { useEffect } from 'react'
import Canvas from '../components/canvas'
import { HEIGHT, WIDTH } from '../constants'
import gameManager from '../lib/gameManager'

export default function SinglePlayerGame() {
  const onCanvas = (canvas: HTMLCanvasElement) => {
    gameManager.startSinglePlayerGame(canvas)
  }

  useEffect(() => {
    // Cleaner function to remove game from db when we leave this page
    return gameManager.clean
  }, [])

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
