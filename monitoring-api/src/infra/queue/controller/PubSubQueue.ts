import Queue, { consumeCheckHandlerFunction, consumeStartHandlerFunction } from "../../../application/queue/Queue";
import GooglePubSub from "../adapter/GooglePubSub";

export default class PubSubQueueManager implements Queue {

    readonly adapter: GooglePubSub;

    constructor() {
        this.adapter = new GooglePubSub(process.env.GOOGLE_PROJECT_ID!);
    }

    async connect(): Promise<void> {
        return new Promise(async resolve => {
            await this.adapter.connect();
            resolve();
        });
    }

    start(
        token: string,
        accountId: number,
        farmId: number,
        workerId: number,
        monitoringId: string
    ) {
        this.adapter.send(
            "oc-start-topic",
            { token, accountId, farmId, workerId, monitoringId }
        );
    }

    check(
        token: string,
        accountId: number,
        farmId: number,
        workerId: number,
        monitoringId: string,
        counter: number
    ) {
        this.adapter.send(
            "oc-check-topic",
            { token, accountId, farmId, workerId, monitoringId, counter }
        );
    }

    consumeStart(callback: consumeStartHandlerFunction): void {
        this.adapter.consume("oc-check-subscription", (message: object | null, ack: Function) => {
            const { token, accountId, farmId, workerId, monitoringId } = message as any;
            callback(token, accountId, farmId, workerId, monitoringId, ack);
        });
    }

    consumeCheck(callback: consumeCheckHandlerFunction): void {
        this.adapter.consume("oc-check-subscription", (message: object | null, ack: Function) => {
            const { token, accountId, farmId, workerId, monitoringId, counter } = message as any;
            callback(token, accountId, farmId, workerId, monitoringId, counter, ack);
        });
    }

}