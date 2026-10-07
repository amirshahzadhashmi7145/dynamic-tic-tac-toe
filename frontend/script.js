const cells = Array.from(document.querySelectorAll(".cell"));
const messageEl = document.getElementById("message");
const statsEl = document.getElementById("stats");
const timerEl = document.getElementById("timer");
const symbolButtons = Array.from(document.querySelectorAll("[data-symbol]"));
const resetBtn = document.getElementById("reset");
const playerId =
  localStorage.getItem("tttPlayerId") ||
  (() => {
    const id = "p_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("tttPlayerId", id);
    return id;
  })();

let pollTimer = null;

function render(state) {
  const board = state.board || [];
  cells.forEach((cell, i) => {
    cell.textContent = board[i] || "";
    cell.classList.toggle("filled", Boolean(board[i]));
  });
  messageEl.textContent = state.message || "";
  messageEl.classList.toggle("error", /error|Invalid|Not your|timed/i.test(state.message || ""));
  const s = state.statistics || {};
  statsEl.textContent = `Games ${s.totalGamesPlayed || 0} · Wins ${s.wins || 0} · Losses ${s.losses || 0} · Draws ${s.draws || 0} · Win rate ${s.winRate || 0}%`;
  if (state.status === "playing") {
    timerEl.textContent = `Turn timer: ${state.remainingSeconds ?? 30}s / ${state.maxSeconds ?? 30}s`;
  } else {
    timerEl.textContent = "Turn timer: —";
  }
  symbolButtons.forEach((btn) => {
    btn.disabled = state.status === "playing";
    btn.classList.toggle("selected", btn.dataset.symbol === state.playerSymbol);
  });
}

async function api(path, options) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    messageEl.textContent = data.message || data.error || `Request failed (${res.status})`;
    messageEl.classList.add("error");
    if (data.board) render(data);
    return null;
  }
  render(data);
  return data;
}

async function refresh() {
  const res = await fetch("/api/state");
  if (!res.ok) return;
  render(await res.json());
}

symbolButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    api("/backend/choose-symbol", {
      method: "POST",
      body: JSON.stringify({ symbol: btn.dataset.symbol }),
    });
  });
});

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    if (cell.classList.contains("filled")) return;
    api("/api/move", {
      method: "POST",
      body: JSON.stringify({ index: Number(cell.dataset.index) }),
    });
  });
});

resetBtn.addEventListener("click", () => {
  api("/api/reset", { method: "POST", body: "{}" });
});

async function boot() {
  await fetch("/backend/reconnect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId }),
  }).catch(() => {});
  await refresh();
  pollTimer = setInterval(refresh, 1000);
}

boot();
window.addEventListener("beforeunload", () => clearInterval(pollTimer));
