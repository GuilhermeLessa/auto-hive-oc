import type UseCase from "./UseCase";
import { left, right, type Either } from "../../domain/shared/Either";
import GpuData from "@/domain/entity/GpuData";
import type { CreateGpuData, GpuDataErrors } from "@/domain/entity/GpuData";

export default class ValidateSettings implements UseCase {

    constructor() { }

    execute(input: ValidateSettingsInput): ValidateSettingsOutput {
        const { accountId, farmId, workerId, gpus } = input;
        const gpuData: CreateGpuData[] = this.sanitize(accountId, farmId, workerId, gpus);
        const creations = GpuData.createAll(gpuData);
        if (creations.errors.length) {
            return left(creations.errors);
        }
        return right(creations.success);
    }

    private sanitize(accountId: number, farmId: number, workerId: number, gpus: gpus)
        : CreateGpuData[] {
        return gpus.map((gpu: any) => {
            return {
                accountId: parseInt(accountId),
                farmId: parseInt(farmId),
                workerId: parseInt(workerId),
                bus: parseInt(gpu.bus),
                brand: gpu.brand,
                isMonitoringCore: !!gpu.isMonitoringCore,
                maximumCoreTemperature: parseInt(gpu.maximumCoreTemperature),
                initialCoreClock: parseInt(gpu.initialCoreClock),
                maximumCoreClock: parseInt(gpu.maximumCoreClock),
                memorieTemperature: parseInt(gpu.memorieTemperature),
                isMonitoringMemorie: !!gpu.isMonitoringMemorie,
                maximumMemorieTemperature: parseInt(gpu.maximumMemorieTemperature),
                initialMemorieClock: parseInt(gpu.initialMemorieClock),
                maximumMemorieClock: parseInt(gpu.maximumMemorieClock),
            };
        });
    }
}

type gpus = Array<{
    bus: number,
    brand: string,
    isMonitoringCore: boolean,
    maximumCoreTemperature: number,
    initialCoreClock: number,
    maximumCoreClock: number,
    memorieTemperature: number,
    isMonitoringMemorie: boolean
    maximumMemorieTemperature: number,
    initialMemorieClock: number,
    maximumMemorieClock: number
}>;

export type ValidateSettingsInput = {
    accountId: number,
    farmId: number,
    workerId: number,
    gpus: gpus
};

export type ValidateSettingsOutput = Promise<
    Either<
        GpuDataErrors[],
        GpuData[]
    >
>;
