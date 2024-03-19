import { Schema, Connection } from 'mongoose';
import AccountMongoData from "./AccountMongoData";
import AccountData from '../../../../../domain/entity/data/AccountData';
import AbstractMongoModel from '../../AbstractMongoModel';

export default class AccountMongoModel extends AbstractMongoModel {

    constructor(connection: Connection) {
        super(
            connection,
            'Account',
            new Schema<AccountMongoData>({
                _id: { type: Schema.Types.UUID, required: true },
                token: { type: String, required: true },
                accountId: { type: Number, required: true },
                createdAt: { type: Date, required: true },
            })
        );
    }

    fromEntity(accountData: AccountData) {
        return {
            _id: accountData.uuid,
            token: accountData.token,
            accountId: accountData.accountId,
            createdAt: accountData.createdAt,
        };
    }

}
