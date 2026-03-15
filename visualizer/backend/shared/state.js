import EventEmitter from 'events';
import { Client } from '../streamer/clientInterface.js';
import { LoggingClient } from '../streamer/loggingClient.js';

// STATE EVENTS
export const RECORDS_CHANGE = 'recordChanged';

// CLIENT EVENTS
export const NEW_MESSAGE = 'message';
export const CLEAR_RECORDS = 'clear';

class State {
    // TODO: this mixes up state and message handling

    constructor() {
        /** @type {Set<Client>} */
        this._clients = new Set();
        this._recordsToReplay = [];
        this._events = new EventEmitter();

        this.registerClient(new LoggingClient());

        this._events.addListener(RECORDS_CHANGE, (event) => {
            this._clients.forEach((client) => {
                client.handleEvent(event);
            });
        });
    }

    /** @param {Client} client */
    registerClient(client) {
        for (let record of this._recordsToReplay) {
            client.handleEvent({
                type: NEW_MESSAGE,
                data: record,
            });
        }
        this._clients.add(client);
    }

    /** @param {Client} client */
    unregisterClient(client) {
        const result = this._clients.delete(client);
        if (!result) {
            console.warn('Attempted to unregister a client that was not registered');
        }
    }

    addRecord(record) {
        this._recordsToReplay.push(record);
        this._events.emit(RECORDS_CHANGE, {
            type: NEW_MESSAGE,
            data: record,
        });
    }

    clearRecords() {
        this._recordsToReplay.length = 0;
        this._events.emit(RECORDS_CHANGE, {
            type: CLEAR_RECORDS,
            data: {},
        });
    }
}

const state = new State();
export default state;
