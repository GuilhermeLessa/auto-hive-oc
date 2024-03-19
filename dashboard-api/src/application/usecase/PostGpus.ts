import UseCase from "./UseCase";
import { Either, left, right } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import GenericRepositoryError from "../repository/GenericRepositoryError";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import GpuData, { GpuDataErrors } from "../../domain/entity/data/GpuData";
import GpuRepository from "../repository/GpuRepository";
import GetHiveOsWorker from "./GetHiveOsWorker";

export default class PostGpus implements UseCase {

    constructor(
        private getHiveOsWorker: GetHiveOsWorker,
        private gpuRepository: GpuRepository
    ) { }

    async execute(input: PostGpusInput): PostGpusOutput {
        const { token, accountId, farmId, workerId, gpus } = input;

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

        const gpusCreationData = [];
        for (let i = 0; i < gpus.length; i++) {
            const gpu: any = gpus[i];
            const hiveOsGpuOrError = hiveOsWorker.getGpu(gpu.bus);
            if (hiveOsGpuOrError.isLeft()) {
                const error = hiveOsGpuOrError.value;
                return left(error);
            }
            const hiveOsGpu = hiveOsGpuOrError.value;
            gpusCreationData.push({
                accountId,
                farmId,
                workerId,
                bus: gpu.bus,
                brand: hiveOsGpu.brand,
                isMonitoringCore: gpu.isMonitoringCore,
                maximumCoreTemperature: gpu.maximumCoreTemperature,
                initialCoreClock: gpu.initialCoreClock,
                maximumCoreClock: gpu.maximumCoreClock,
                memorieTemperature: hiveOsGpu.memtemp,
                isMonitoringMemorie: gpu.isMonitoringMemorie,
                maximumMemorieTemperature: gpu.maximumMemorieTemperature,
                initialMemorieClock: gpu.initialMemorieClock,
                maximumMemorieClock: gpu.maximumMemorieClock
            });
        }

        const creations = GpuData.createAll(gpusCreationData);
        if (creations.errors.length) {
            return left(creations.errors);
        }

        const deleteGpuDataOrError = await this.gpuRepository.deleteMany(accountId, farmId, workerId);
        if (deleteGpuDataOrError.isLeft()) {
            const error = deleteGpuDataOrError.value;
            return left(error);
        }

        const insertGpuDataOrError = await this.gpuRepository.insertMany(creations.success);
        if (insertGpuDataOrError.isLeft()) {
            const error = insertGpuDataOrError.value;
            return left(error);
        }

        return right("done");
    }

}

export type PostGpusInput = {
    token: string,
    accountId: number,
    farmId: number,
    workerId: number,
    gpus: Array<{
        bus: number,
        isMonitoringCore: boolean,
        maximumCoreTemperature: number,
        initialCoreClock: number,
        maximumCoreClock: number,
        isMonitoringMemorie: boolean,
        maximumMemorieTemperature: number,
        initialMemorieClock: number,
        maximumMemorieClock: number
    }>
};

export type PostGpusOutput = Promise<
    Either<
        GenericHttpError | UnauthorizedHttpError | GenericRepositoryError | ApplicationError | GpuDataErrors[],
        "done"
    >
>;
