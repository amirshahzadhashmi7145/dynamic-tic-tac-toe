const express = require('express');
const router = express.Router();

let playerStats = {
    wins: 0,
    losses: 0,
    draws: 0,
};

router.get('/statistics', (req, res) => {
    const totalGames = playerStats.wins + playerStats.losses + playerStats.draws;
    const winRate = totalGames > 0 ? (playerStats.wins / totalGames) * 100 : 0;
    res.status(200).json({
        statistics: {
            totalGamesPlayed: totalGames,
            winRate: winRate,
            wins: playerStats.wins,
            losses: playerStats.losses,
            draws: playerStats.draws
        }
    });
});

module.exports = router;