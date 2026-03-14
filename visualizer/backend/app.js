import express, { json, static as static_ } from 'express';
import { join } from 'path';
import { shouldCapture } from './filter.js';
import { createRecord } from './mappers.js';
import { logRecord } from './logging.js';

export function createApp() {
    // In-memory store of slim records and connected SSE clients
    const records = [];
    const clients = new Set();

    function sendEventToClients(eventName, data) {
        const frame = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
        for (const client of clients) {
            client.write(frame);
        }
    }

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

        // Replay existing records
        for (const record of records) {
            res.write(`event: message\ndata: ${JSON.stringify(record)}\n\n`);
        }

        clients.add(res);
        req.on('close', () => clients.delete(res));
    });

    // Clear all records and notify all connected clients
    app.post('/events/clear', (req, res) => {
        records.length = 0;
        sendEventToClients('clear', {});
        return res.status(204).send();
    });

    app.post('/events/register', (req, res) => {
        const payload = req.body;

        if (!shouldCapture(payload)) {
            return res.status(204).send();
        }

        const record = createRecord(payload);
        logRecord(record);

        const slim = {
            source: record.source.nickname,
            destination: record.destination.nickname,
            method: record.method,
            url: record.url,
        };
        records.push(slim);
        sendEventToClients('message', slim);

        return res.status(204).send();
    });

    return app;
}
