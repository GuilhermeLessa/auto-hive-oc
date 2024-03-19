import { Connection } from 'mongoose';
import GpuMongoModel from './GpuMongoModel';
import { Either, left, right } from '../../../../../domain/shared/Either';
import GenericRepositoryError from '../../../../../application/repository/GenericRepositoryError';
import GpuRepository from '../../../../../application/repository/GpuRepository';
import GpuData, { GpuDataResult, RestoreGpuData } from '../../../../../domain/entity/data/GpuData';
import GpuMongoData from './GpuMongoData';

export default class GpuMongoRepository implements GpuRepository {

    private model: GpuMongoModel;

    constructor(
        connection: Connection,
    ) {
        this.model = new GpuMongoModel(connection);
    }

    async find(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                GpuDataResult
            >
        > {
        return new Promise(resolve => {
            this.model.model
                .find({ accountId, farmId, workerId })
                .sort({ bus: 1 })
                .then((result: any) => {
                    if (!result) {
                        return resolve(
                            right({ success: [], errors: [] })
                        );
                    }
                    const restoredData: Array<RestoreGpuData> =
                        result.map((gpuData: GpuMongoData) =>
                            this.model.fromModel(gpuData)
                        );
                    return resolve(
                        right(GpuData.restoreAll(restoredData))
                    );
                })
                .catch((error: any) => {
                    return resolve(
                        left(new GenericRepositoryError(error))
                    );
                });
        });
    }

    async findOnlyMonitoringTrue(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                GpuDataResult
            >
        > {
        return new Promise(resolve => {
            this.model.model
                .find({ accountId, farmId, workerId, $or: [{ monitoringCore: true }, { monitoringMem: true }] })
                .sort({ bus: 1 })
                .then((result: any) => {
                    if (!result) {
                        return resolve(
                            right({ success: [], errors: [] })
                        );
                    }
                    const restoredData: Array<RestoreGpuData> =
                        result.map((gpuData: GpuMongoData) =>
                            this.model.fromModel(gpuData)
                        );
                    return resolve(
                        right(GpuData.restoreAll(restoredData))
                    );
                })
                .catch((error: any) => {
                    return resolve(
                        left(new GenericRepositoryError(error))
                    );
                });
        });
    }

}
