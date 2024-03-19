import UseCase from "./UseCase";
import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";
import WorkerRepository from "../repository/WorkerRepository";
import GenericRepositoryError from "../repository/GenericRepositoryError";
import WorkerData from "../../domain/entity/data/WorkerData";
import GpuRepository from "../repository/GpuRepository";
import MonitoringApiInterface from "../monitoring/MonitoringApiInterface";
import GetHiveOsWorker from "./GetHiveOsWorker";

export default class StartMonitoring implements UseCase {

    constructor(
        private getHiveOsWorker: GetHiveOsWorker,
        private workerRepository: WorkerRepository,
        private gpuRepository: GpuRepository,
        private monitoringApi: MonitoringApiInterface,
    ) { }

    async execute(input: StartMonitoringInput): StartMonitoringOutput {
        const { token, accountId, farmId, workerId, monitoring } = input;

        if (monitoring == false) {
            return left(new ApplicationError("Start monitoring requires a true signal"));
        }

        const getHiveOsWorkerInput = { token, accountId, farmId, workerId };
        const hiveOsWorkerOrError = await this.getHiveOsWorker.execute(getHiveOsWorkerInput);
        if (hiveOsWorkerOrError.isLeft()) {
            const error = hiveOsWorkerOrError.value;
            return left(error);
        }
        const hiveOsWorker = hiveOsWorkerOrError.value;

        if (!hiveOsWorker.isOnline()) {
            return left(
                new ApplicationError(
                    "Worker offline",
                    "Worker offline"
                )
            );
        }

        const gpuDataResultOrError = await this.gpuRepository.findOnlyMonitoringTrue(accountId, farmId, workerId);
        if (gpuDataResultOrError.isLeft()) {
            const error = gpuDataResultOrError.value;
            return left(error);
        }

        const gpuDataResult = gpuDataResultOrError.value;
        if (!gpuDataResult.success.length) {
            return left(
                new ApplicationError(
                    "No valid GPU data set as monitoring ON",
                    "No valid GPU data set as monitoring ON"
                )
            );
        }

        const getWorkerDataOrError = await this.workerRepository.findOne(accountId, farmId, workerId);
        if (getWorkerDataOrError.isLeft()) {
            const error = getWorkerDataOrError.value;
            return left(error);
        }

        const workerData = getWorkerDataOrError.value;
        if (workerData && workerData.isMonitoring) {
            return right("done");
        }

        const monitoringWorkerData = WorkerData.create(accountId, farmId, workerId, true);

        const deleteWorkerDataOrError = await this.workerRepository.deleteMany(accountId, farmId, workerId);
        if (deleteWorkerDataOrError.isLeft()) {
            const error = deleteWorkerDataOrError.value;
            return left(error);
        }

        const insertWorkerDataOrError = await this.workerRepository.insertOne(monitoringWorkerData);
        if (insertWorkerDataOrError.isLeft()) {
            const error = insertWorkerDataOrError.value;
            return left(error);
        }

        const insertedWorkerData = insertWorkerDataOrError.value;
        if (!insertedWorkerData || !insertedWorkerData.uuid) {
            return left(new ApplicationError("Error trying insert monitoring state"));
        }

        await this.monitoringApi.startMonitor(
            token,
            accountId,
            farmId,
            workerId,
            insertedWorkerData.uuid
        );

        return right('done');
    }

}

export type StartMonitoringInput = {
    token: string, accountId: number, farmId: number, workerId: number, monitoring: boolean
};

export type StartMonitoringOutput = Promise<
    Either<
        GenericRepositoryError | GenericHttpError | UnauthorizedHttpError | ApplicationError,
        "done"
    >
>;
