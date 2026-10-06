function checkDrawCondition(gameState) {
    if (gameState.isDraw) {
        return {
            statusCode: 200,
            message: 'Draw Message'
        };
    }
    return null;
}

module.exports = checkDrawCondition;