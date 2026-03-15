import express from 'express';
import sharedState from '../shared/state.js';
import UiClient from './clients/uiClient.js';

export const streamerRoutes = express.Router();

// SSE endpoint — replays history then streams live events
streamerRoutes.get('/listen', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sseClient = new UiClient(res);
    sharedState.registerClient(sseClient);
    req.on('close', () => sharedState.unregisterClient(sseClient));
});

// Clear all records and notify all connected clients
streamerRoutes.post('/clear', (req, res) => {
    sharedState.clearRecords();
    return res.status(204).send();
});
