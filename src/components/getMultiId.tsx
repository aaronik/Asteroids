import React from 'react'
import { MultiPlayerGameData } from '../types'

type GetMultiplayerGameIdProps = {
  gameData: MultiPlayerGameData[]
  onGameId: (gameId: string) => void
}

export default function GetMultiPlayerGameId(props: GetMultiplayerGameIdProps) {

  const activeGameIds = props.gameData.map(game => game?.gameId).filter(Boolean)

  return (
    <React.Fragment>
      <div id='session-request'>

        <label>Choose From These Active Games:</label>

        {
          activeGameIds.map(gameId => {
            return <button key={gameId} className='button' onClick={props.onGameId.bind(null, gameId)}>{gameId}</button>
          })
        }

      </div>
    </React.Fragment >
  )
}
