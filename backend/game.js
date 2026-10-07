/** Shared in-memory game + session state for the API. */

const MAX_SECONDS = 30;

const sessions = Object.create(null);

function emptyBoard() {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
}

function createGame() {
  return {
    board: emptyBoard(),
    playerSymbol: null,
    computerSymbol: null,
    current: null,
    status: "choose", // choose | playing | won | draw
    winner: null,
    message: "Choose X or O to start.",
    turnEndsAt: null,
    stats: { wins: 0, losses: 0, draws: 0 },
  };
}

let game = createGame();

function ensureSession(playerId) {
  if (!playerId) return null;
  if (!sessions[playerId]) {
    sessions[playerId] = { playerId, joinedAt: Date.now() };
  }
  return sessions[playerId];
}

function flatBoard() {
  return game.board.flat();
}

function checkWin(symbol, board) {
  const lines = [
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]],
  ];
  for (const line of lines) {
    if (line.every((cell) => cell === symbol)) {
      return true;
    }
  }
  return false;
}

function isDraw(board) {
  return board.flat().every((cell) => cell !== null);
}

function startTurnClock() {
  game.turnEndsAt = Date.now() + MAX_SECONDS * 1000;
}

function remainingSeconds() {
  if (!game.turnEndsAt) return MAX_SECONDS;
  return Math.max(0, Math.ceil((game.turnEndsAt - Date.now()) / 1000));
}

function publicState() {
  const total =
    game.stats.wins + game.stats.losses + game.stats.draws;
  const winRate = total > 0 ? Math.round((game.stats.wins / total) * 100) : 0;
  return {
    board: flatBoard(),
    playerSymbol: game.playerSymbol,
    computerSymbol: game.computerSymbol,
    current: game.current,
    status: game.status,
    winner: game.winner,
    message: game.message,
    maxSeconds: MAX_SECONDS,
    remainingSeconds: remainingSeconds(),
    statistics: {
      totalGamesPlayed: total,
      winRate,
      wins: game.stats.wins,
      losses: game.stats.losses,
      draws: game.stats.draws,
    },
  };
}

function chooseSymbol(symbol) {
  if (symbol !== "X" && symbol !== "O") {
    return { status: 400, body: { error: "Invalid symbol", message: "red error" } };
  }
  game = createGame();
  game.playerSymbol = symbol;
  game.computerSymbol = symbol === "X" ? "O" : "X";
  game.current = "X";
  game.status = "playing";
  game.message =
    game.current === game.playerSymbol
      ? `You are ${symbol}. Your turn.`
      : `You are ${symbol}. Computer starts.`;
  startTurnClock();
  if (game.current === game.computerSymbol) {
    computerMove();
  }
  return { status: 200, body: { chosenSymbol: symbol, ...publicState() } };
}

function computerMove() {
  if (game.status !== "playing" || game.current !== game.computerSymbol) return;
  const empties = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (game.board[r][c] === null) empties.push([r, c]);
    }
  }
  if (!empties.length) return;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  game.board[r][c] = game.computerSymbol;
  finishTurn(game.computerSymbol, "Computer");
}

function finishTurn(symbol, name) {
  if (checkWin(symbol, game.board)) {
    game.status = "won";
    game.winner = symbol;
    game.message = `Congratulation ${name} you won`;
    if (symbol === game.playerSymbol) game.stats.wins += 1;
    else game.stats.losses += 1;
    game.turnEndsAt = null;
    return;
  }
  if (isDraw(game.board)) {
    game.status = "draw";
    game.message = "Draw Message";
    game.stats.draws += 1;
    game.turnEndsAt = null;
    return;
  }
  game.current = symbol === "X" ? "O" : "X";
  startTurnClock();
  if (game.status === "playing" && game.current === game.computerSymbol) {
    computerMove();
  } else if (game.status === "playing") {
    game.message = `Your turn (${game.playerSymbol}).`;
  }
}

function playMove(index) {
  if (game.status !== "playing") {
    return {
      status: 400,
      body: { error: "red error", message: "Game is not in progress. Choose a symbol first." },
    };
  }
  if (game.current !== game.playerSymbol) {
    return { status: 400, body: { error: "red error", message: "Not your turn." } };
  }
  if (remainingSeconds() <= 0) {
    // Auto-skip player turn on timeout.
    game.current = game.computerSymbol;
    game.message = "Turn timed out. Computer plays.";
    computerMove();
    return { status: 200, body: { validMove: false, timedOut: true, ...publicState() } };
  }
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i > 8) {
    return { status: 400, body: { error: "red error", message: "Invalid cell." } };
  }
  const r = Math.floor(i / 3);
  const c = i % 3;
  if (game.board[r][c] !== null) {
    return { status: 400, body: { error: "red error", message: "Cell already taken." } };
  }
  game.board[r][c] = game.playerSymbol;
  finishTurn(game.playerSymbol, "You");
  return { status: 200, body: { validMove: true, ...publicState() } };
}

function resetGame() {
  const stats = { ...game.stats };
  game = createGame();
  game.stats = stats;
  return { status: 200, body: publicState() };
}

module.exports = {
  MAX_SECONDS,
  ensureSession,
  sessions,
  publicState,
  chooseSymbol,
  playMove,
  resetGame,
  remainingSeconds,
};
