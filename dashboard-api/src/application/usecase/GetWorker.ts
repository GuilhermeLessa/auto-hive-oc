import UseCase from "./UseCase";
import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";
import WorkerRepository from "../repository/WorkerRepository";
import GenericRepositoryError from "../repository/GenericRepositoryError";
import GpuRepository from "../repository/GpuRepository";
import DashboardWorker from "../../domain/entity/core/worker/DashboardWorker";
import WorkerData from "../../domain/entity/data/WorkerData";
import GetHiveOsWorker from "./GetHiveOsWorker";

export default class GetWorker implements UseCase {

    constructor(
        private getHiveOsWorker: GetHiveOsWorker,
        private workerRepository: WorkerRepository,
        private gpuRepository: GpuRepository,
    ) { }

    async execute(input: GetWorkerInput): GetWorkerOutput {
        const { token, accountId, farmId, workerId } = input;

        const workerDataOrError = await this.workerRepository.findOne(accountId, farmId, workerId);
        if (workerDataOrError.isLeft()) {
            const error = workerDataOrError.value;
            return left(error);
        }
        const workerData = workerDataOrError.value || WorkerData.create(accountId, farmId, workerId, false);;

        const gpuDataResultOrError = await this.gpuRepository.find(accountId, farmId, workerId);
        if (gpuDataResultOrError.isLeft()) {
            const error = gpuDataResultOrError.value;
            return left(error);
        }
        const gpuDataResult = gpuDataResultOrError.value;
        const gpusData = gpuDataResult.success;

        const getHiveOsWorkerInput = { token, accountId, farmId, workerId } ;
        const hiveOsWorkerOrError = await this.getHiveOsWorker.execute(getHiveOsWorkerInput);
        if (hiveOsWorkerOrError.isLeft()) {
            const error = hiveOsWorkerOrError.value;
            return left(error);
        }
        const hiveOsWorker = hiveOsWorkerOrError.value;

        const worker = new DashboardWorker(hiveOsWorker.data, workerData, gpusData);

        if (!hiveOsWorker.isOnline()) {
            return right({
                id: hiveOsWorker.id,
                name: hiveOsWorker.name,
                monitoring: worker.isMonitoring,
                online: false,
                gpus: [],
            });
        }

        const { gpus } = worker.getDashboardGpuData();

        return right({
            id: hiveOsWorker.id,
            name: hiveOsWorker.name,
            monitoring: worker.isMonitoring,
            online: true,
            gpus
        });
    }

}

export type GetWorkerInput = {
    token: string, accountId: number, farmId: number, workerId: number
};

export type GetWorkerOutput = Promise<
    Either<
        GenericHttpError | UnauthorizedHttpError | GenericRepositoryError | ApplicationError,
        {
            id: number,
            name: string,
            monitoring: boolean,
            online: boolean,
            gpus: Array<{
                isMonitoringCore: boolean,
                maximumCoreTemperature: number,
                initialCoreClock: number,
                maximumCoreClock: number,
                isMonitoringMemorie: boolean,
                maximumMemorieTemperature: number,
                initialMemorieClock: number,
                maximumMemorieClock: number
            }>
        }
    >
>;
