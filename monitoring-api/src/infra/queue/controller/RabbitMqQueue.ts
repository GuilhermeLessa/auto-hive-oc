import Queue, { consumeCheckHandlerFunction, consumeStartHandlerFunction } from "../../../application/queue/Queue";
import RabbitMq from "../adapter/RabbitMq";

export default class RabbitMqQueue implements Queue {

    readonly adapter: RabbitMq;

    constructor() {
        this.adapter = new RabbitMq(
            process.env.RABBIT_USER!,
            process.env.RABBIT_PASSWORD!,
            process.env.RABBIT_HOST!,
            process.env.RABBIT_PORT!,
        );
    }

    async connect(): Promise<void> {
        return new Promise(async resolve => {
            await this.adapter.connect();
            await this.adapter.assert("auto-hive-oc:start", true);
            await this.adapter.assert("auto-hive-oc:check", true);
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
            "auto-hive-oc:start",
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
            "auto-hive-oc:check",
            { token, accountId, farmId, workerId, monitoringId, counter }
        );
    }

    consumeStart(callback: consumeStartHandlerFunction): void {
        this.adapter.consume("auto-hive-oc:start", (message: object | null, ack: Function) => {
            const { token, accountId, farmId, workerId, monitoringId } = message as any;
            callback(token, accountId, farmId, workerId, monitoringId, ack);
        });
    }

    consumeCheck(callback: consumeCheckHandlerFunction): void {
        this.adapter.consume("auto-hive-oc:check", (message: object | null, ack: Function) => {
            const { token, accountId, farmId, workerId, monitoringId, counter } = message as any;
            callback(token, accountId, farmId, workerId, monitoringId, counter, ack);
        });
    }

}