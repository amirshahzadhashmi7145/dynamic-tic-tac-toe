const express = require('express');
const router = express.Router();

const MAX_SECONDS = 30;

// Endpoint to get turn timer for a player
router.post('/turn-timer', (req, res) => {
    const { playerId } = req.body;
    if (!playerId) {
        return res.status(400).json({ error: 'playerId is required' });
    }
    // Simulate turn timer logic
    const remainingSeconds = MAX_SECONDS;
    return res.status(200).json({ maxSeconds: MAX_SECONDS, remainingSeconds });
});

module.exports = router;