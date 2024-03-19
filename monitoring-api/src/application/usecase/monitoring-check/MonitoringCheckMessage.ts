import Queue from "../../queue/Queue";

export default class MonitoringCheckMessage {

    private MIN_MS = 60000;

    constructor(
        readonly token: string,
        readonly accountId: number,
        readonly farmId: number,
        readonly workerId: number,
        readonly monitoringId: string,
        private queue: Queue,
        private ack: Function,
        private counter: number,
    ) { }

    stop(): void {
        this.ack();
    }

    retry(): void {
        setTimeout(() => {
            this.queue.check(this.token, this.accountId, this.farmId, this.workerId, this.monitoringId, this.counter);
            this.ack();
        }, this.MIN_MS);
    }

    next(hasTemperatureEmergency: boolean): void {
        const delay = hasTemperatureEmergency ? this.MIN_MS : this.nextDelay(this.counter);
        setTimeout(() => {
            this.queue.check(this.token, this.accountId, this.farmId, this.workerId, this.monitoringId, ++this.counter);
            this.ack();
        }, delay);
    }

    private nextDelay(counter: number) {
        if (counter < 5) { // first 4 checks of 30 seconds
            return this.MIN_MS / 2; // total 2 minutes
        }
        if (counter < 13) { // next 8 checks of 1 minute
            return this.MIN_MS; // +8 minutes = total 10 minutes
        }
        if (counter < 18) { // next 5 checks of 3 minutes
            return this.MIN_MS * 3; // +15 minutes = total 25 minutes
        }
        return this.MIN_MS * 5; // after first half hour, perpetual checks each 5 minutes
    };

}