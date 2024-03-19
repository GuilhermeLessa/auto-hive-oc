import { ENV } from "../../../domain/shared/ENV";
import AbstractQueueHandler from "./AbstractQueueHandler";
import Queue from "../../../application/queue/Queue";
import PubSubQueue from "../controller/PubSubQueue";

export default class GoogleQueueHandler extends AbstractQueueHandler {
    handle(env: ENV): PubSubQueue | Queue | null {
        if (env == ENV.GOOGLE_CLOUD) {
            return new PubSubQueue();
        }
        return super.handle(env);
    }
}