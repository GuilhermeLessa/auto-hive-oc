import { ENV } from "../../domain/shared/ENV";
import LocalQueueHandler from "./handler/LocalQueueHandler";
import GoogleQueueHandler from "./handler/GoogleQueueHandler";
import Queue from "../../application/queue/Queue";

export default class QueueProvider {

    private queue: Queue | null;

    constructor(env: ENV) {
        const localQueueHandler = new LocalQueueHandler();
        const googleQueueHandler = new GoogleQueueHandler();
        localQueueHandler.setNext(googleQueueHandler);
        this.queue = localQueueHandler.handle(env);
        if (!this.queue) {
            throw new Error("Queue manager undefined");
        }
    }

    provide(): Queue {
        return this.queue!;
    }
}