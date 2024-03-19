import WorkerData from '../../domain/entity/data/WorkerData';
import { Either } from '../../domain/shared/Either';
import GenericRepositoryError from './GenericRepositoryError';

export default interface WorkerRepository {

    insertOne(workerData: WorkerData)
        : Promise<
            Either<
                GenericRepositoryError,
                { uuid: string } | null
            >
        >;

    findOne(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                WorkerData | null
            >
        >;

    deleteMany(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                { deletedCount: number }
            >
        >;
        
}
