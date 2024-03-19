import { Schema } from 'mongoose';

export default interface AccountMongoData {
    _id: Schema.Types.UUID,
    token: string;
    accountId: number;
    createdAt: Date;
}
