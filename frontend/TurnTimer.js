import React, { useEffect, useState } from 'react';

const TurnTimer = () => {
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    // Handle timeout logic here, e.g., send a timeout message
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <h2>Turn Timer</h2>
            <p>{timeLeft} seconds left</p>
        </div>
    );
};

export default TurnTimer;