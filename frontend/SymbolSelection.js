import React, { useState } from 'react';

const SymbolSelection = () => {
    const [selectedSymbol, setSelectedSymbol] = useState('');

    const handleSymbolSelect = (symbol) => {
        setSelectedSymbol(symbol);
        // Here you would typically send the selected symbol to the backend
        // For example: fetch('/api/select-symbol', { method: 'POST', body: JSON.stringify({ symbol }) })
    };

    return (
        <div>
            <h2>Select Your Symbol</h2>
            <div>
                <button onClick={() => handleSymbolSelect('X')}>X</button>
                <button onClick={() => handleSymbolSelect('O')}>O</button>
                <button onClick={() => handleSymbolSelect('A')}>A</button>
                <button onClick={() => handleSymbolSelect('B')}>B</button>
            </div>
            {selectedSymbol && <p>You have selected: {selectedSymbol}</p>}
        </div>
    );
};

export default SymbolSelection;