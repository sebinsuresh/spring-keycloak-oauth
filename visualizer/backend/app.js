import express, { json, static as static_ } from 'express';
import { join } from 'path';
import { listenerRoutes } from './listener/routes.js';
import state from './shared/state.js';
import { UiClient } from './streamer/uiClient.js';

export function createApp() {
    const app = express();

    app.use(json({ limit: '10mb' }));

    // Serve the frontend
    app.use(static_(join(
        import.meta.dirname,
        '..',
        'public',
    )));

    // Serve mermaid.js from node_modules
    app.get('/mermaid.min.js', (req, res) => {
        res.sendFile(join(
            import.meta.dirname,
            '..',
            'node_modules',
            'mermaid',
            'dist',
            'mermaid.min.js',
        ));
    });

    // SSE endpoint — replays history then streams live events
    app.get('/events/listen', (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const sseClient = new UiClient(res);
        state.registerClient(sseClient);
        req.on('close', () => state.unregisterClient(sseClient));
    });

    // Clear all records and notify all connected clients
    app.post('/events/clear', (req, res) => {
        state.clearRecords();
        return res.status(204).send();
    });

    app.use('/capture', listenerRoutes);

    return app;
}
