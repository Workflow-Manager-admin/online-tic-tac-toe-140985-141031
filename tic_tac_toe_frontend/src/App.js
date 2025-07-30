import React, { useState, useEffect } from "react";
import "./App.css";

/* --- Constants: Theme, colors, sizes --- */
const BOARD_SIZE = 3;
const PLAYER_X = "X";
const PLAYER_O = "O";
const DRAW = "Draw";

// PUBLIC_INTERFACE
function App() {
  // Theme state (default to dark, matching requirements)
  const [theme, setTheme] = useState("dark");

  // Game board state: array of 9 squares, null = empty
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
  // Player state: whose turn, winner, isDraw
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell !== null);

  // Side effect to apply dark/light theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // PUBLIC_INTERFACE
  const handleSquareClick = (i) => {
    if (board[i] != null || winner) return; // don't allow moves if game over or spot filled
    const nextBoard = board.slice();
    nextBoard[i] = xIsNext ? PLAYER_X : PLAYER_O;
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE - Restart button
  const restartGame = () => {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(null));
    setXIsNext(true);
  };

  // Game status (turn, win, draw)
  let status;
  if (winner) {
    status = winner === DRAW
      ? "It's a draw!"
      : `Winner: ${winner}`;
  } else {
    status = `Next turn: ${xIsNext ? PLAYER_X : PLAYER_O}`;
  }

  // PUBLIC_INTERFACE
  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div className="tic-tac-toe-container">
          <Title />
          <GameBoard
            board={board}
            onSquareClick={handleSquareClick}
            winner={winner}
            isDraw={isDraw}
          />
          <div className="status" aria-live="polite">{status}</div>
          <button className="restart-btn" onClick={restartGame}>
            Restart Game
          </button>
        </div>
        <footer className="footer-note">
          <span>
            Minimal Tic Tac Toe &mdash; Two-player | {theme[0].toUpperCase() + theme.slice(1)} Theme
          </span>
        </footer>
      </header>
    </div>
  );
}

/* --- Components --- */

// PUBLIC_INTERFACE
function Title() {
  return (
    <h1 className="game-title">
      <span style={{ color: "#FFC107" }}>Tic</span>{" "}
      <span style={{ color: "#1976D2" }}>Tac</span>{" "}
      <span style={{ color: "#388E3C" }}>Toe</span>
    </h1>
  );
}

// PUBLIC_INTERFACE
function GameBoard({ board, onSquareClick, winner, isDraw }) {
  return (
    <div className="board">
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onSquareClick(idx)}
          disabled={!!winner || !!isDraw || value !== null}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, disabled }) {
  return (
    <button
      className="square"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square${value ? " " + value : ""}`}
    >
      {value}
    </button>
  );
}

/* --- Logic: Calculate Winner --- */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
