import Queue from "../../queue/Queue";

export default class MonitoringStartMessage {

    private MIN_MS = 60000;

    constructor(
        readonly token: string,
        readonly accountId: number,
        readonly farmId: number,
        readonly workerId: number,
        readonly monitoringId: string,
        private queue: Queue,
        private ack?: Function,
    ) { }

    start(): void {
        this.queue.start(this.token, this.accountId, this.farmId, this.workerId, this.monitoringId);
    }

    stop(): void {
        this.ack!();
    }

    retry(): void {
        setTimeout(() => {
            this.queue.start(this.token, this.accountId, this.farmId, this.workerId, this.monitoringId);
            this.ack!();
        }, this.MIN_MS);
    }

    next(): void {
        setTimeout(() => {
            this.queue.check(this.token, this.accountId, this.farmId, this.workerId, this.monitoringId, 1);
            this.ack!();
        }, this.MIN_MS / 2);
    }

}