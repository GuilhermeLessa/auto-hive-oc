export type consumeHandlerFunction = (message: object | null, ack: Function) => void;

export default interface QueueAdapter {
    connect(): Promise<void>;
    send(queue: string, message: object): void;
    consume(queue: string, callback: consumeHandlerFunction): void;
}