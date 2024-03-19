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

    insertOne(workerData: WorkerData)
        : Promise<
            Either<
                GenericRepositoryError,
                { uuid: string } | null
            >
        > {
        return new Promise(resolve => {
            const data = this.model.fromEntity(workerData);
            this.model
                .createModel(data).save()
                .then((result: any) => {
                    return resolve(
                        right(result.id ? { uuid: result.id } : null)
                    );
                })
                .catch((error: any) => {
                    return resolve(
                        left(new GenericRepositoryError(error))
                    );
                });
        });
    }

    findOne(accountId: number, farmId: number, workerId: number)
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

    deleteMany(accountId: number, farmId: number, workerId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                { deletedCount: number }
            >
        > {
        return new Promise(resolve => {
            this.model.model
                .deleteMany({ accountId, farmId, workerId })
                .then((result: any) => {
                    return resolve(
                        right({ deletedCount: result.deletedCount })
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
