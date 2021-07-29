// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board() {
  const [squares, setSquares] = useLocalStorageState(
    'TicTacToeGame',
    Array(9).fill(null),
  )

  const [nextValue, setNextValue] = React.useState(null)
  const [winner, setWinner] = React.useState(null)
  const [status, setStatus] = React.useState(null)

  /**
   * Set Next Value
   */
  React.useEffect(() => {
    const nextValue = [...squares].filter(Boolean).length % 2 === 0 ? 'X' : 'O'
    setNextValue(nextValue)
  }, [squares])

  /**
   * Calculate the Winner...
   */
  React.useEffect(() => {
    const calculateWinner = () => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c]
        ) {
          return squares[a]
        }
      }
      return null
    }

    setWinner(calculateWinner())
  }, [squares])

  /**
   * Calculate the Status
   */
  React.useEffect(() => {
    const status = winner
      ? `Winner: ${winner}`
      : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`

    setStatus(status)
  }, [squares, winner, nextValue])

  // This is the function your square click handler will call. `square` should
  // be an index. So if they click the center square, this will be `4`.
  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    const updatedSquares = [...squares]
    updatedSquares[square] = nextValue

    setSquares(updatedSquares)
  }

  function restart() {
    setSquares(Array(9).fill(null))
  }

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      {/* 🐨 put the status in the div below */}
      <div className="status">{status}</div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
      <button className="restart" onClick={restart}>
        restart
      </button>
    </div>
  )
}

function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  )
}

function App() {
  return <Game />
}

export default App
