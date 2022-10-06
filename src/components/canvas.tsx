import React, { useRef, useEffect } from 'react'

type CanvasProps = {
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
