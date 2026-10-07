# Dynamic Tic Tac Toe

Playable single-page game: pick **X** or **O**, take turns against a simple computer opponent, with turn timer and win/loss/draw stats.

## Run locally

```bash
git clone https://github.com/amirshahzadhashmi7145/dynamic-tic-tac-toe.git
cd dynamic-tic-tac-toe
npm install
npm start
```

Open [http://localhost:3001](http://localhost:3001) (or set `PORT`).

## How to play

1. Click **X** or **O**.
2. Click an empty cell on your turn.
3. Each turn has a **30s** timer (shown under the symbol buttons).
4. **Reset Game** clears the board but keeps session stats.

## API (used by the page)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/state` | Board, message, timer, stats |
| POST | `/backend/choose-symbol` | `{ "symbol": "X" \| "O" }` |
| POST | `/api/move` | `{ "index": 0..8 }` |
| POST | `/api/reset` | New board |
| GET | `/api/player/stats` | Wins / losses / draws |
| POST | `/backend/reconnect` | `{ "playerId" }` |
| POST | `/backend/turn-timer` | `{ "playerId" }` |

The React files under `frontend/*.js` (except `script.js`) are leftover stubs from earlier agent tasks; the running UI is plain HTML + `script.js` served by `backend/server.js`.
