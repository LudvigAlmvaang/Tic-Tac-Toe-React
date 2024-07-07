import { useState } from "react";
import { Circle } from "lucide-react";
import { X } from "lucide-react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square outline contrast" onClick={onSquareClick}>
      {value === "X" && <X size={64} color="#ffa348" />}
      {value === "O" && <Circle size={64} color="#62a0ea" />}
    </button>
  );
}


function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner === "Draw") {
    status = "It's a Draw!";
  } else if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <h2 className="status">{status}</h2>
      {Array(3).fill(undefined).map(function(_, row) {
        return (
          <div key={row} className="board-row grid container">
            {Array(3).fill(undefined).map(function(_, col) {
              return (
                <Square
                  key={row * 3 + col}
                  value={squares[row * 3 + col]}
                  onSquareClick={function() { handleClick(row * 3 + col); }}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(undefined)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map(function(squares, move) {
    let description;
    if (move !== currentMove) {
      description = 'Go to move #' + move;
    } else if (move === currentMove) {
      description = "You are at move #" + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={function() { jumpTo(move); }}>{description}</button>
      </li>
    );
  });

  function resetGame() {
    setHistory([Array(9).fill(undefined)]);
    setCurrentMove(0);
  }

  return (
    <main className="container">
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>
            {moves}
            <button className="secondary" onClick={resetGame}>Reset Game</button>
          </ol>
        </div>
      </div>
    </main>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  const isFullBoard = squares.every(function(square) {
    return square !== undefined;
  });

  if (isFullBoard) {
    return "Draw";
  }
  return undefined;
}
