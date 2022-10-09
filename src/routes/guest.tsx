import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import GetMultiPlayerGameId from '../components/getMultiId'
import NoGames from '../components/no-games'
import { HEIGHT, WIDTH } from '../constants'
import MultiPlayerGameGuest from '../game/multiPlayerGameGuest'
import { APP_ID, db, network } from '../network'
import { MultiPlayerGameData } from '../types'

// TODO Get the HEIGHT/WIDTH from the game host and use those dimensions
/**
* @description This is kind of a weird one, it presents two different screens
* based on its state. if a game hasn't been selected, a selection screen,
* otherwise, the game itself, as a guest.
*
*/
export default function JoinMultiPlayerGame() {

  const [gameId, setGameId] = useState<string>('')
  const [dbGames, setDbGames] = useState<MultiPlayerGameData[]>([])
  const [game, setGame] = useState<MultiPlayerGameGuest>()

  // Change handler abstracted for cleanup
  const onDbChange = () => {
    setDbGames(
      db.getAll().map(w => w.state).filter(Boolean) as MultiPlayerGameData[]
    )
  }

  // Subscribe to database updates
  useEffect(() => {
    db.onChange(onDbChange)
  }, [])

  // Unsubscribe / Cleanup by Notifying network of our leaving
  useEffect(() => {
    return () => {

      // Clean DB
      db.removeChangeHandler(onDbChange)

      // Without these, we haven't joined a game yet
      if (!gameId || !game) return

      // Tell folks we're leaving before we kill the game
      network.broadcast({
        type: 'guestLeaving',
        data: game?.shipId,
        appId: APP_ID(game)
      })

      game.teardown()
    }
  }, [gameId, game])

  // Guaranteed to happen only when we have a valid game
  const onCanvas = (canvas: HTMLCanvasElement) => {
    const g = new MultiPlayerGameGuest(gameId, canvas)
    setGame(g)
  }

  if (!dbGames.length) return (
    <NoGames />
  )

  if (!gameId) return (
    <GetMultiPlayerGameId gameData={dbGames} onGameId={setGameId} />
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
