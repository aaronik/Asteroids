import SinglePlayerGame from "../game/singlePlayerGame"
import MultiPlayerGameGuest from "../game/multiplayerGameGuest"
import MultiPlayerGameHost from "../game/multiplayerGameHost"
import { db } from '../network'
import MultiplayerListener from "./multiplayerListener"

// TODO Wherever the unloadListener equivalent is for when
// we go back a page, make that be here or both in the same place

class GameManager {
  // TODO make this static and export GameManager instead of gameManager
  game?: MultiPlayerGameHost | MultiPlayerGameGuest | SinglePlayerGame

  /*
   * Call this to perform cleaning actions regarding a game. For example,
   * clear the DB of that game if it's multi player, stop the game from running,
   * etc.
   */
  clean = () => {
    if (!this.game) {
      console.warn('Gamemanager.clean() called when there\'s no game present')
    }
    db.set(null)
    this.game?.teardown()
    delete this.game
  }

  startSinglePlayerGame = (canvas: HTMLCanvasElement) => {
    if (this.game) this.clean()
    this.game = new SinglePlayerGame(canvas)
    this.setupUnloadListener()
  }

  hostMultiPlayerGame = (canvas: HTMLCanvasElement) => {
    if (this.game) this.clean()
    const gameId = crypto.randomUUID().slice(-5) // Take just the last 5 chars
    this.game = new MultiPlayerGameHost(gameId, canvas)
    MultiplayerListener.startListening(this.game as MultiPlayerGameHost)
    this.setupUnloadListener()
  }

  joinMultiPlayerGame = (canvas: HTMLCanvasElement, gameId: string) => {
    if (this.game) this.clean()
    this.game = new MultiPlayerGameGuest(gameId, canvas)
    MultiplayerListener.startListening(this.game as MultiPlayerGameGuest)
    this.setupUnloadListener()
  }

  // We want to make sure when the window closes we aren't leaving our hosted
  // games around
  private setupUnloadListener = () => {
    // TODO Also consider doing a db.clear() so we don't have stale games at startup
    window.addEventListener("beforeunload", this.clean, false);
  }

}

const gameManager = new GameManager()

export default gameManager
