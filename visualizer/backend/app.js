import express, { json } from 'express';
import { listenerRoutes } from './listener/routes.js';
import { streamerRoutes } from './streamer/routes.js';
import { frontendRoutes } from './streamer/frontend.js';

export function createApp() {
    const app = express();
    app.use(json({ limit: '10mb' }));

    app.use(frontendRoutes);
    app.use('/events', streamerRoutes);
    app.use('/capture', listenerRoutes);

    return app;
}
