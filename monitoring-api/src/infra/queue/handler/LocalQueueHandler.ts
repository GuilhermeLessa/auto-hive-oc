import { ENV } from "../../../domain/shared/ENV";
import AbstractQueueHandler from "./AbstractQueueHandler";
import Queue from "../../../application/queue/Queue";
import RabbitMqQueue from "../controller/RabbitMqQueue";

export default class LocalQueueHandler extends AbstractQueueHandler {
    handle(env: ENV): RabbitMqQueue | Queue |  null {
        if (env == ENV.LOCALHOST) {
            return new RabbitMqQueue();
        }
        return super.handle(env);
    }
}