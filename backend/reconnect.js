/** Session reconnect helper — used by server.js via game.ensureSession. */
module.exports = function attachReconnect(app, game) {
  app.post("/backend/reconnect", (req, res) => {
    const playerId = req.body && req.body.playerId;
    const session = game.ensureSession(playerId);
    if (!session) {
      return res.status(400).json({ error: "Invalid player ID" });
    }
    return res.status(200).json({ rejoined: true, ...game.publicState() });
  });
};
