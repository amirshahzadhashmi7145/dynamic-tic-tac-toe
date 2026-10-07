const path = require("path");
const express = require("express");
const game = require("./game");

const app = express();
// Default 3001 so local Atelier (often on 3000) does not collide.
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.get("/api/state", (_req, res) => {
  res.status(200).json(game.publicState());
});

app.post("/backend/choose-symbol", (req, res) => {
  const result = game.chooseSymbol(req.body && req.body.symbol);
  res.status(result.status).json(result.body);
});

app.post("/api/select-symbol", (req, res) => {
  const result = game.chooseSymbol(req.body && req.body.symbol);
  res.status(result.status).json(result.body);
});

app.post("/api/move", (req, res) => {
  const result = game.playMove(req.body && req.body.index);
  res.status(result.status).json(result.body);
});

app.post("/api/reset", (_req, res) => {
  const result = game.resetGame();
  res.status(result.status).json(result.body);
});

app.get("/api/player/stats", (_req, res) => {
  const state = game.publicState();
  res.status(200).json({
    wins: state.statistics.wins,
    losses: state.statistics.losses,
    draws: state.statistics.draws,
    totalGames: state.statistics.totalGamesPlayed,
    winRate: state.statistics.winRate,
  });
});

app.get("/statistics", (_req, res) => {
  res.status(200).json({ statistics: game.publicState().statistics });
});

app.post("/backend/reconnect", (req, res) => {
  const playerId = req.body && req.body.playerId;
  const session = game.ensureSession(playerId);
  if (!session) {
    return res.status(400).json({ error: "Invalid player ID" });
  }
  return res.status(200).json({ rejoined: true, ...game.publicState() });
});

app.post("/backend/turn-timer", (req, res) => {
  const playerId = req.body && req.body.playerId;
  if (!playerId) {
    return res.status(400).json({ error: "playerId is required" });
  }
  game.ensureSession(playerId);
  return res.status(200).json({
    maxSeconds: game.MAX_SECONDS,
    remainingSeconds: game.remainingSeconds(),
  });
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Tic Tac Toe running at http://localhost:${PORT}`);
});
