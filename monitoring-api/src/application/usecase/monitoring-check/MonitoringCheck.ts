import UseCase from "../UseCase";
import WorkerRepository from "../../repository/WorkerRepository";
import GpuRepository from "../../repository/GpuRepository";
import HiveOsApiInterface from "../../hiveos/HiveOsApiInterface";
import MonitoringCheckWorker from "../../../domain/entity/core/worker/MonitoringCheckWorker";
import GetHiveOsWorker from "../GetHiveOsWorker";
import MonitoringCheckMessage from "./MonitoringCheckMessage";

export default class MonitoringCheck implements UseCase {

    constructor(
        private workerRepository: WorkerRepository,
        private gpuRepository: GpuRepository,
        private getHiveOsWorker: GetHiveOsWorker,
        private hiveOsApi: HiveOsApiInterface,
    ) { }

    async execute(input: MonitoringCheckInput): MonitoringCheckOutput {
        const { message } = input;
        const { token, accountId, farmId, workerId, monitoringId } = message;

        const workerDataOrError = await this.workerRepository.findOne(accountId, farmId, workerId);
        if (workerDataOrError.isLeft()) {
            message.retry();
            return;
        }
        const workerData = workerDataOrError.value;
        if (!workerData) {
            message.stop();
            return;
        }
        if (workerData.uuid != monitoringId) {
            message.stop();
            return;
        }
        if (!workerData.isMonitoring) {
            message.stop();
            return;
        }

        const gpuDataResultOrError = await this.gpuRepository.findOnlyMonitoringTrue(accountId, farmId, workerId);
        if (gpuDataResultOrError.isLeft()) {
            message.retry();
            return;
        }
        const gpuDataResult = gpuDataResultOrError.value;
        if (!gpuDataResult.success.length) {
            message.retry();
            return;
        }
        const gpusData = gpuDataResult.success;

        const getHiveOsWorkerInput = { token, accountId, farmId, workerId };
        const hiveOsWorkerOrError = await this.getHiveOsWorker.execute(getHiveOsWorkerInput);
        if (hiveOsWorkerOrError.isLeft()) {
            message.retry();
            return;
        }
        const hiveOsWorker = hiveOsWorkerOrError.value;

        if (!hiveOsWorker.isMining()) {
            message.retry();
            return;
        }

        const worker = new MonitoringCheckWorker(hiveOsWorker.data, gpusData);
        worker.tunneOverclock();
        const postData = worker.getPostOverclocksData();

        const responseOrError = await this.hiveOsApi.postOverclocks(token, farmId, workerId, postData);
        if (responseOrError.isLeft()) {
            message.retry();
            return;
        }

        message.next(worker.getHasTemperatureEmergency());
    }

}

export type MonitoringCheckInput = {
    message: MonitoringCheckMessage
};

export type MonitoringCheckOutput = Promise<void>;
