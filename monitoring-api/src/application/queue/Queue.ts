import QueueAdapter from "./QueueAdapter";

export type consumeStartHandlerFunction = (
    token: string,
    accountId: number,
    farmId: number,
    workerId: number,
    monitoringId: string,
    ack: Function
) => void;

export type consumeCheckHandlerFunction = (
    token: string,
    accountId: number,
    farmId: number,
    workerId: number,
    monitoringId: string,
    counter: number,
    ack: Function
) => void;

export default interface Queue {

    readonly adapter: QueueAdapter;

    connect(): Promise<void>;

    start(
        token: string,
        accountId: number,
        farmId: number,
        workerId: number,
        monitoringId: string,
    ): void;

    check(
        token: string,
        accountId: number,
        farmId: number,
        workerId: number,
        monitoringId: string,
        counter: number,
    ): void;

    consumeStart(callback: consumeStartHandlerFunction): void;

    consumeCheck(callback: consumeCheckHandlerFunction): void;

}
