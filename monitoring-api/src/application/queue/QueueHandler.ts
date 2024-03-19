import Queue from "./Queue";

export default interface QueueHandler {
    setNext(handler: QueueHandler): QueueHandler;
    handle(env: string): Queue | null;
}