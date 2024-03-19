import { Schema, Connection } from 'mongoose';
import WorkerMongoData from "./WorkerMongoData";
import WorkerData from '../../../../../domain/entity/data/WorkerData';
import AbstractMongoModel from '../../AbstractMongoModel';

export default class WorkerMongoModel extends AbstractMongoModel {

    constructor(connection: Connection) {
        super(
            connection,
            'Worker',
            new Schema<WorkerMongoData>({
                _id: { type: Schema.Types.UUID, required: true },
                accountId: { type: Number, required: true },
                farmId: { type: Number, required: true },
                workerId: { type: Number, required: true },
                isMonitoring: { type: Boolean, required: true },
                createdAt: { type: Date, required: true },
            })
        );
    }

    fromEntity(workerData: WorkerData) {
        return {
            _id: workerData.uuid,
            accountId: workerData.accountId,
            farmId: workerData.farmId,
            workerId: workerData.workerId,
            isMonitoring: workerData.isMonitoring,
            createdAt: workerData.createdAt,
        };
    }

}
