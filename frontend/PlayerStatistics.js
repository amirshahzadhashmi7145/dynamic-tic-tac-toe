import React, { useEffect, useState } from 'react';

const PlayerStatistics = () => {
    const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0, totalGames: 0, winRate: 0 });

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await fetch('/api/player/stats');
            if (response.status === 200) {
                const data = await response.json();
                setStats(data);
            }
        };
        fetchStatistics();
    }, []);

    return (
        <div>
            <h1>Player Statistics</h1>
            <p>Total Games Played: {stats.totalGames}</p>
            <p>Wins: {stats.wins}</p>
            <p>Losses: {stats.losses}</p>
            <p>Draws: {stats.draws}</p>
            <p>Win Rate: {stats.winRate}%</p>
        </div>
    );
};

export default PlayerStatistics;