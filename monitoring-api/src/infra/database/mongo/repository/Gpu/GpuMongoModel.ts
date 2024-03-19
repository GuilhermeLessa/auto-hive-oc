import { Schema, Connection } from 'mongoose';
import { RestoreGpuData } from '../../../../../domain/entity/data/GpuData';
import AbstractMongoModel from '../../AbstractMongoModel';
import GpuMongoData from './GpuMongoData';
import GpuData from '../../../../../domain/entity/data/GpuData';

export default class GpuMongoModel extends AbstractMongoModel {

    constructor(connection: Connection) {
        super(
            connection,
            'Gpu',
            new Schema<GpuMongoData>({
                _id: { type: Schema.Types.UUID, required: true },
                accountId: { type: Number, required: true },
                farmId: { type: Number, required: true },
                workerId: { type: Number, required: true },
                bus: { type: Number, required: true },
                isMonitoringCore: { type: Boolean, required: true },
                maximumCoreTemperature: { type: Number, required: true },
                initialCoreClock: { type: Number, required: true },
                maximumCoreClock: { type: Number, required: true },
                isMonitoringMemorie: { type: Boolean, required: true },
                maximumMemorieTemperature: { type: Number, required: true },
                initialMemorieClock: { type: Number, required: true },
                maximumMemorieClock: { type: Number, required: true },
                createdAt: { type: Date, required: true },
            })
        );
    }

    fromEntity(gpuData: GpuData): GpuMongoData {
        return {
            _id: (gpuData.uuid as unknown) as Schema.Types.UUID,
            accountId: gpuData.accountId,
            farmId: gpuData.farmId,
            workerId: gpuData.workerId,
            bus: gpuData.bus,
            isMonitoringCore: gpuData.isMonitoringCore,
            maximumCoreTemperature: gpuData.maximumCoreTemperature,
            initialCoreClock: gpuData.initialCoreClock,
            maximumCoreClock: gpuData.maximumCoreClock,
            isMonitoringMemorie: gpuData.isMonitoringMemorie,
            maximumMemorieTemperature: gpuData.maximumMemorieTemperature,
            initialMemorieClock: gpuData.initialMemorieClock,
            maximumMemorieClock: gpuData.maximumMemorieClock,
            createdAt: gpuData.createdAt,
        };
    }

    fromModel(gpuMongoData: GpuMongoData): RestoreGpuData {
        return {
            uuid: gpuMongoData._id.toString(),
            accountId: gpuMongoData.accountId,
            farmId: gpuMongoData.farmId,
            workerId: gpuMongoData.workerId,
            bus: gpuMongoData.bus,
            brand: null,
            isMonitoringCore: gpuMongoData.isMonitoringCore,
            maximumCoreTemperature: gpuMongoData.maximumCoreTemperature,
            initialCoreClock: gpuMongoData.initialCoreClock,
            maximumCoreClock: gpuMongoData.maximumCoreClock,
            memorieTemperature: 0,
            isMonitoringMemorie: gpuMongoData.isMonitoringMemorie,
            maximumMemorieTemperature: gpuMongoData.maximumMemorieTemperature,
            initialMemorieClock: gpuMongoData.initialMemorieClock,
            maximumMemorieClock: gpuMongoData.maximumMemorieClock,
            createdAt: gpuMongoData.createdAt,
        };
    }

}
