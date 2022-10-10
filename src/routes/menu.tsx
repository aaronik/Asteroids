import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
* @description
*
* @param {string} direction - 'in' for only fade in, 'out' for only fade out, neither
* for both.
*/
const useFade = (direction?: 'in' | 'out') => {
  const [opacity, setOpacity] = useState(direction === 'out' ? 1 : 0)

  const fadeOut = () => {
    if (direction === 'in') return
    setOpacity(0)
  }

  useEffect(() => {
    if (direction === 'in') setOpacity(1)
  }, [direction])

  const buildFade = (ms: number) => {
    return {
      style: {
        transition: 'all ' + ms / 1000 + 's ease-out',
        opacity: opacity
      }
    }
  }

  return [buildFade, fadeOut] as [typeof buildFade, typeof fadeOut]
}

export default function Menu() {

  const navigate = useNavigate()
  const [buildFade, fadeOut] = useFade('out')

  const onClick = (type: 's' | 'h' | 'g') => () => {
    fadeOut()
    setTimeout(() => {
      switch (type) {
        case 's': navigate('/single'); break
        case 'h': navigate('/host'); break
        case 'g': navigate('/guest'); break
      }
    }, 700)
  }

  return (
    <React.Fragment>
      <div id="main-wrapper" {...buildFade(900)}>

        <h1>Aaronik's Asteroids</h1>

        <div id="T-top-divider-div" className="divider-div">
          <img alt='' src="horizontal_page_divider.png" />
        </div>

        <div id="lower-pane-wrapper" {...buildFade(300)}>

          <div id="index-left-pane" className="index-pane">
            <div onClick={onClick('s')} className="button left-button">Single Player</div>
          </div>

          <div id="T-center-divider-div" className="divider-div">
            <img alt='' src="vertical_page_divider.png" />
          </div>

          <div id="index-right-pane" className="index-pane">
            <div onClick={onClick('h')} className="button right-button">
              Host New Multi Player Game
            </div>
            <div onClick={onClick('g')} className="button right-button">
              Join Existing Multi Player Game
            </div>
          </div>

        </div>

      </div>

      <div id='footer-container'>
        <footer
          {...buildFade(500)}>Copyright © Aaronik 2013-present
        </footer>
      </div>
    </React.Fragment>
  )
}
