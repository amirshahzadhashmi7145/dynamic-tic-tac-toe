const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let sessions = {};

app.use(express.json());

app.post('/backend/reconnect', (req, res) => {
    const { playerId } = req.body;
    if (!playerId || !sessions[playerId]) {
        return res.status(400).json({ error: 'Invalid player ID' });
    }
    // Logic to handle rejoining the game
    res.status(200).json({ rejoined: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
