import UseCase from "./UseCase";
import { Either, left, right } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import WorkerRepository from "../repository/WorkerRepository";
import GenericRepositoryError from "../repository/GenericRepositoryError";
import WorkerData from "../../domain/entity/data/WorkerData";

export default class StopMonitoring implements UseCase {

    constructor(
        private workerRepository: WorkerRepository,
    ) { }

    async execute(input: StopMonitoringInput): StopMonitoringOutput {
        const { accountId, farmId, workerId, monitoring } = input;

        if (monitoring == true) {
            return left(new ApplicationError("Stop monitoring requires a false signal"));
        }

        const getWorkerDataOrError = await this.workerRepository.findOne(accountId, farmId, workerId);
        if (getWorkerDataOrError.isLeft()) {
            const error = getWorkerDataOrError.value;
            return left(error);
        }

        const workerData = getWorkerDataOrError.value;
        if (workerData && !workerData.isMonitoring) {
            return right("done");
        }

        const nonMonitoringWorkerData = WorkerData.create(accountId, farmId, workerId, false);

        const deleteWorkerDataOrError = await this.workerRepository.deleteMany(accountId, farmId, workerId);
        if (deleteWorkerDataOrError.isLeft()) {
            const error = deleteWorkerDataOrError.value;
            return left(error);
        }

        const insertWorkerDataOrError = await this.workerRepository.insertOne(nonMonitoringWorkerData);
        if (insertWorkerDataOrError.isLeft()) {
            const error = insertWorkerDataOrError.value;
            return left(error);
        }

        const insertedWorkerData = insertWorkerDataOrError.value;
        if (!insertedWorkerData || !insertedWorkerData.uuid) {
            return left(new ApplicationError("Error trying insert monitoring state"));
        }

        return right('done');
    }

}

export type StopMonitoringInput = {
    accountId: number, farmId: number, workerId: number, monitoring: boolean
};

export type StopMonitoringOutput = Promise<
    Either<
        GenericRepositoryError | ApplicationError,
        "done"
    >
>;
