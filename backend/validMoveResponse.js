function validMoveResponse() {
    return {
        statusCode: 200,
        response: { validMove: true }
    };
}

module.exports = validMoveResponse;