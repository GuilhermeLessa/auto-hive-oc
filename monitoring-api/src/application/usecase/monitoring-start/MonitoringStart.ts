import UseCase from "../UseCase";
import WorkerRepository from "../../repository/WorkerRepository";
import GpuRepository from "../../repository/GpuRepository";
import HiveOsApiInterface from "../../hiveos/HiveOsApiInterface";
import MonitoringStartWorker from "../../../domain/entity/core/worker/MonitoringStartWorker";
import GetHiveOsWorker from "../GetHiveOsWorker";
import MonitoringStartMessage from "./MonitoringStartMessage";

export default class MonitoringStart implements UseCase {

    constructor(
        private workerRepository: WorkerRepository,
        private gpuRepository: GpuRepository,
        private getHiveOsWorker: GetHiveOsWorker,
        private hiveOsApi: HiveOsApiInterface,
    ) { }

    async execute(input: MonitoringStartInput): MonitoringStartOutput {
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

        const worker = new MonitoringStartWorker(hiveOsWorker.data, gpusData);
        const postData = worker.getPostOverclocksData();

        const responseOrError = await this.hiveOsApi.postOverclocks(token, farmId, workerId, postData);
        if (responseOrError.isLeft()) {
            message.retry();
            return;
        }

        message.next();
    }

}

export type MonitoringStartInput = {
    message: MonitoringStartMessage
};

export type MonitoringStartOutput = Promise<void>;