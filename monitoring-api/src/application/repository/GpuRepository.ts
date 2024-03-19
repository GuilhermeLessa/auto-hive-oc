import { GpuDataResult } from '../../domain/entity/data/GpuData';
import { Either } from '../../domain/shared/Either';
import GenericRepositoryError from './GenericRepositoryError';

export default interface GpuRepository {

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

}
