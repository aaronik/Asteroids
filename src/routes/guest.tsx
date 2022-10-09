import { useEffect, useState } from 'react'
import Canvas from '../components/canvas'
import GetMultiPlayerGameId from '../components/getMultiId'
import NoGames from '../components/no-games'
import MultiPlayerGameGuest from '../game/multiPlayerGameGuest'
import { APP_ID, db, network } from '../network'
import { MultiPlayerGameData } from '../types'

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

  // Guaranteed to happen only when we have a valid gameId
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

  const { height, width } = dbGames.find(dbGame => dbGame.gameId === gameId) as MultiPlayerGameData

  return (
    <div id='main-wrapper'>
      <Canvas
        height={height}
        width={width}
        onCanvas={onCanvas}
      />
    </div>
  )
}
