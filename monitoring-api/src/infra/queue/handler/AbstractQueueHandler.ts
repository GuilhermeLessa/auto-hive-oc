import { ENV } from "../../../domain/shared/ENV";
import QueueHandler from "../../../application/queue/QueueHandler";
import Queue from "../../../application/queue/Queue";

export default abstract class AbstractQueueHandler implements QueueHandler {
    private nextHandler!: QueueHandler;

    setNext(handler: QueueHandler): QueueHandler {
        this.nextHandler = handler;
        return handler;
    }

    handle(env: ENV): Queue | null {
        if (this.nextHandler) {
            return this.nextHandler.handle(env);
        }
        return null;
    }
}



