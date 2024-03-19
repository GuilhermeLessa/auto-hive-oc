import WorkerData from '../../domain/entity/data/WorkerData';
import { Either } from '../../domain/shared/Either';
import GenericRepositoryError from './GenericRepositoryError';

export default interface WorkerRepository {

    findOne(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                WorkerData | null
            >
        >;

}
