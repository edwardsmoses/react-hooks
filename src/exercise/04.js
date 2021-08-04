// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, onClick}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
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
    </div>
  )
}

function Game() {
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'TicTacToeGame',
    Array(9).fill(null),
  )

  const [history, setHistory] = useLocalStorageState('TicTacToeGameHistory', [])
  const [currentStep, setCurrentStep] = useLocalStorageState(
    'TicTacToeGameStep',
    0,
  )

  const [nextValue, setNextValue] = React.useState(null)
  const [winner, setWinner] = React.useState(null)
  const [status, setStatus] = React.useState(null)

  /**
   * Set Next Value
   */
  React.useEffect(() => {
    const nextValue =
      [...currentSquares].filter(Boolean).length % 2 === 0 ? 'X' : 'O'
    setNextValue(nextValue)
  }, [currentSquares])

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
          currentSquares[a] &&
          currentSquares[a] === currentSquares[b] &&
          currentSquares[a] === currentSquares[c]
        ) {
          return currentSquares[a]
        }
      }
      return null
    }

    setWinner(calculateWinner())
  }, [currentSquares])

  /**
   * Calculate the Status
   */
  React.useEffect(() => {
    const status = winner
      ? `Winner: ${winner}`
      : currentSquares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`

    setStatus(status)
  }, [currentSquares, winner, nextValue])

  const selectSquare = square => {
    if (winner || currentSquares[square]) {
      return
    }

    const updatedSquares = [...currentSquares]
    updatedSquares[square] = nextValue

    setCurrentSquares(updatedSquares)

    setCurrentStep(prev => prev + 1)
  }

  React.useEffect(() => {
    const updatedHistory = history.slice(0, currentStep);
    updatedHistory[currentStep] = currentSquares;
    setHistory(updatedHistory)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const restart = () => {
    setCurrentSquares(Array(9).fill(null))
    setHistory([])
    setCurrentStep(null)
  }

  const moves = history.map((move, index) => (
    <li key={index}>
      <button
        className=""
        disabled={index === currentStep}
        onClick={() => {
          setCurrentSquares(move)
          setCurrentStep(index)
        }}
      >
        Go to {index === 0 ? 'Game Start' : `move #${index}`}{' '}
        {currentStep === index ? '(current)' : null}
      </button>
    </li>
  ))

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

function App() {
  return <Game />
}

export default App
