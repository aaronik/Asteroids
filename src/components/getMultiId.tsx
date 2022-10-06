import React, { useState } from 'react'
import { db } from '../network'
import { getActiveGameIds } from '../util'

type GetMultiplayerGameIdProps = {
  onGameId: (gameId: string) => void
}

export default function GetMultiplayerGameId(props: GetMultiplayerGameIdProps) {

  const [activeGameIds, setActiveGameIds] = useState<string[]>(getActiveGameIds())

  db.onChange(() => {
    setActiveGameIds(getActiveGameIds())
  })

  if (activeGameIds.length === 0) {
    return (
      <div id='session-request'>
        <label>Sorry, there don't seem to be any active games at the moment. </label>
        <p>Try hosting one yourself!</p>
        <code>Or, wait until the network establishes a connection or somebody else hosts one.</code>
      </div>
    )
  }

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
