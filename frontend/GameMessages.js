import React from 'react';

const GameMessages = ({ message, statusCode }) => {
    return (
        <div className={`game-message ${statusCode === 400 ? 'error' : 'success'}`}> 
            {message}
        </div>
    );
};

export default GameMessages;
