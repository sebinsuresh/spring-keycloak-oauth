import { CLEAR_RECORDS, NEW_MESSAGE } from "../../shared/state.js";
import Client from "./clientInterface.js";

export default class UiClient extends Client {
    constructor(backingRes) {
        super();
        this._backingRes = backingRes;
    }

    handleEvent(event) {
        const data = event.data;

        if (event.type === NEW_MESSAGE) {
            const formattedData = JSON.stringify(this._mapRecord(data));
            this._backingRes.write(
                `event: ${NEW_MESSAGE}\ndata: ${formattedData}\n\n`
            );
        } else if (event.type === CLEAR_RECORDS) {
            this._backingRes.write(
                `event: ${CLEAR_RECORDS}\ndata: {}\n\n`
            );
        } else {
            console.log(`Unknown event ${event.type}`);
        }
    }

    _mapRecord(record) {
        return {
            source: record.source.nickname,
            destination: record.destination.nickname,
            method: record.method,
            url: record.url,
        };
    }
}
