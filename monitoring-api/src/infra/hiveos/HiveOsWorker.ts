import HiveOsWorkerData from "../../application/hiveos/HiveOsWorkerData";

export default class HiveOsWorker {

    constructor(
        readonly data: HiveOsWorkerData
    ) { }

    isOnline(): boolean {
        return this.data.stats && this.data.stats.online == true;
    }

    isMining(): boolean {
        const timestamp = (new Date()).getTime();
        return this.isOnline() &&
            this.data.stats.miner_start_time > 0 &&
            this.data.stats.miner_start_time < timestamp
    }

}