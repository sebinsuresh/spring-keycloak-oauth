import express from 'express';
import { shouldCapture } from '../filter.js';
import { createRecord } from '../mappers.js';
import state from '../shared/state.js';

export const listenerRoutes = express.Router();

listenerRoutes.post('/', (req, res) => {
    const payload = req.body;

    if (!shouldCapture(payload)) {
        return res.status(204).send();
    }

    const record = createRecord(payload);
    state.addRecord(record);

    return res.status(204).send();
});
