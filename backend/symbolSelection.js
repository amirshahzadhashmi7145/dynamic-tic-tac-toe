const express = require('express');
const router = express.Router();

// Endpoint to choose symbol
router.post('/choose-symbol', (req, res) => {
    const { symbol } = req.body;
    // Validate symbol
    if (symbol !== 'X' && symbol !== 'O') {
        return res.status(400).json({ error: 'Invalid symbol' });
    }
    // Respond with chosen symbol
    return res.status(200).json({ chosenSymbol: symbol });
});

module.exports = router;