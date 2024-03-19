import { Connection } from 'mongoose';
import AccountMongoModel from './AccountMongoModel';
import AccountRepository from '../../../../../application/repository/AccountRepository';
import { Either, left, right } from '../../../../../domain/shared/Either';
import AccountData from '../../../../../domain/entity/data/AccountData';
import GenericRepositoryError from '../../../../../application/repository/GenericRepositoryError';

export default class AccountMongoRepository implements AccountRepository {

    private model: AccountMongoModel;

    constructor(
        connection: Connection,
    ) {
        this.model = new AccountMongoModel(connection);
    }

    async findOne(token: string, accountId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                AccountData | null
            >
        > {
        return new Promise((resolve) => {
            this.model.model
                .findOne({ token, accountId })
                .then((result: any) => {
                    if (!result) {
                        return resolve(
                            right(null)
                        );
                    }
                    const { id, createdAt } = result;
                    return resolve(
                        right(AccountData.restore(
                            id, token, accountId, createdAt
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

    async insertOne(accountData: AccountData)
        : Promise<
            Either<
                GenericRepositoryError,
                { uuid: string } | null
            >
        > {
        return new Promise(resolve => {
            const data = this.model.fromEntity(accountData);
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

    async deleteMany(accountId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                { deletedCount: number }
            >
        > {
        return new Promise(resolve => {
            let conditions: any = { accountId };
            this.model.model.deleteMany(conditions)
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
