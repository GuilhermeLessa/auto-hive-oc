import { Schema } from 'mongoose';

export default interface WorkerMongoData {
    _id: Schema.Types.UUID,
    accountId: number;
    farmId: number;
    workerId: number;
    isMonitoring: boolean;
    createdAt: Date;
}
