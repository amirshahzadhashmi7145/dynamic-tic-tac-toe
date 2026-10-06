function checkWin(playerName, board) {
    // Logic to check for three in a row
    const winningCombinations = [
        // Rows
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        // Columns
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        // Diagonals
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]]
    ];

    for (const combination of winningCombinations) {
        if (combination.every(cell => cell === playerName)) {
            return { status: 200, message: `Congratulation ${playerName} you won` };
        }
    }
    return null;
}

module.exports = checkWin;