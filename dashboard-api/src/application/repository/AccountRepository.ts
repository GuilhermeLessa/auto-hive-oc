import AccountData from '../../domain/entity/data/AccountData';
import { Either } from '../../domain/shared/Either';
import GenericRepositoryError from './GenericRepositoryError';

export default interface AccountRepository {

    findOne(token: string, accountId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                AccountData | null
            >
        >;

    insertOne(accountData: AccountData)
        : Promise<
            Either<
                GenericRepositoryError,
                { uuid: string } | null
            >
        >;

    deleteMany(accountId: number)
        : Promise<
            Either<
                GenericRepositoryError,
                { deletedCount: number }
            >
        >;

}
