/** Interface for clients that can handle events */
export default class Client {
    handleEvent(event) {
        throw new Error('handleEvent not implemented');
    }
}
