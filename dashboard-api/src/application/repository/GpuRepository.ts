import GpuData from '../../domain/entity/data/GpuData';
import { GpuDataResult } from '../../domain/entity/data/GpuData';
import { Either } from '../../domain/shared/Either';
import GenericRepositoryError from './GenericRepositoryError';

export default interface GpuRepository {

    insertMany(gpusData: Array<GpuData>)
        : Promise<
            Either<
                GenericRepositoryError,
                { insertedCount: number }
            >
        >;

    find(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                GpuDataResult
            >
        >;

    findOnlyMonitoringTrue(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                GpuDataResult
            >
        >;

    deleteMany(accountId: number, farmId: number, workerId: number, bus?: number)
        : Promise<
            Either<
                GenericRepositoryError,
                { deletedCount: number }
            >
        >;

}
