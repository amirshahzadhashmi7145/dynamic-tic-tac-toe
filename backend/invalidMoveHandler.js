function handleInvalidMove(req, res) {
    res.status(400).json({ error: 'red error' });
}

module.exports = handleInvalidMove;