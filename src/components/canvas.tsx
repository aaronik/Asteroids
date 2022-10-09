import { useRef, useEffect } from 'react'

type CanvasProps = {
  // This is the only way to pass back a reference to
  // the actual dom object, which we need to manipulate
  // directly.
  onCanvas: (canvas: HTMLCanvasElement) => void
  height: number
  width: number
}

const Canvas = (props: CanvasProps) => {

  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas === null) {
      throw new Error('Couldnt find canvas element')
    }

    props.onCanvas(canvas)
  }, [])

  const { width, height } = props

  return <canvas ref={canvasRef} {...{ width, height }} />
}

export default Canvas
