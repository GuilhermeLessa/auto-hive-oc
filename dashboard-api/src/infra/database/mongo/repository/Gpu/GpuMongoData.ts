import { Schema } from 'mongoose';

export default interface GpuMongoData {
    _id: Schema.Types.UUID,
    accountId: number;
    farmId: number;
    workerId: number;
    bus: number;
    isMonitoringCore: boolean;
    maximumCoreTemperature: number;
    initialCoreClock: number;
    maximumCoreClock: number;
    isMonitoringMemorie: boolean;
    maximumMemorieTemperature: number;
    initialMemorieClock: number;
    maximumMemorieClock: number;
    createdAt: Date;
}