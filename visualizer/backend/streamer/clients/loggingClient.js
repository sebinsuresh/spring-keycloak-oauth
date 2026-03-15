import { CLEAR_RECORDS, NEW_MESSAGE } from "../../shared/state.js";
import Client from "./clientInterface.js";

export default class LoggingClient extends Client {
    handleEvent(event) {
        const data = event.data;

        if (event.type === NEW_MESSAGE) {
            console.log(this._mapRecord(data));
        } else if (event.type === CLEAR_RECORDS) {
            console.log("==== Records cleared ====");
        } else {
            console.log(`Unknown event ${event.type}`);
        }
    }

    _mapRecord(record) {
        if (!record) return '';
        return (
            `${record.source.nickname} ` +
            `--(${record.method} ${record.url})--> ` +
            `${record.destination.nickname}`
        );
    }
}
