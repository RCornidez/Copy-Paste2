export const upgradeWebSocket = (req, res, wss) => {
    try {
        wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
            wss.send('connection', ws, req);
        });
    } catch (error) {
        console.error('Error upgrading websocket: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
