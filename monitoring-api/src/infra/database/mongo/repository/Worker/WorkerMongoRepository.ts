import { Connection } from 'mongoose';
import WorkerMongoModel from './WorkerMongoModel';
import WorkerRepository from '../../../../../application/repository/WorkerRepository';
import { Either, left, right } from '../../../../../domain/shared/Either';
import GenericRepositoryError from '../../../../../application/repository/GenericRepositoryError';
import WorkerData from '../../../../../domain/entity/data/WorkerData';

export default class WorkerMongoRepository implements WorkerRepository {

    private model: WorkerMongoModel;

    constructor(
        connection: Connection,
    ) {
        this.model = new WorkerMongoModel(connection);
    }

    async findOne(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                WorkerData | null
            >
        > {
        return new Promise((resolve) => {
            this.model.model
                .findOne({ accountId, farmId, workerId })
                .then((result: any) => {
                    if (!result) {
                        return resolve(
                            right(null)
                        );
                    }
                    const { id, isMonitoring, createdAt } = result;
                    return resolve(
                        right(WorkerData.restore(
                            id, accountId, farmId, workerId, isMonitoring, createdAt
                        ))
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
