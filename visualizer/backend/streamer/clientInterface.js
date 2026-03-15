/** Interface for clients that can handle events */
export class Client {
    handleEvent(event) {
        throw new Error('handleEvent not implemented');
    }
}
