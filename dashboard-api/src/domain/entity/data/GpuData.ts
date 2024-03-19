export type GpuDataErrors = Array<{
    bus: number,
    message: string,
}>;

export type GpuDataResult = {
    success: Array<GpuData>, errors: Array<GpuDataErrors>
};

export interface CreateGpuData {
    accountId: number;
    farmId: number;
    workerId: number;
    bus: number;
    brand: string;
    isMonitoringCore: boolean;
    maximumCoreTemperature: number;
    initialCoreClock: number;
    maximumCoreClock: number;
    memorieTemperature: number;
    isMonitoringMemorie: boolean;
    maximumMemorieTemperature: number;
    initialMemorieClock: number;
    maximumMemorieClock: number;
}

export interface RestoreGpuData {
    uuid: string,
    accountId: number;
    farmId: number;
    workerId: number;
    bus: number;
    brand: string | null;
    isMonitoringCore: boolean;
    maximumCoreTemperature: number;
    initialCoreClock: number;
    maximumCoreClock: number;
    memorieTemperature: number,
    isMonitoringMemorie: boolean;
    maximumMemorieTemperature: number;
    initialMemorieClock: number;
    maximumMemorieClock: number;
    createdAt: Date;
}

export default class GpuData {

    static containErrors = (entity: GpuData | GpuDataErrors | GpuDataErrors[]):
        entity is GpuDataErrors => Array.isArray(entity);

    private constructor(
        readonly uuid: string,
        readonly accountId: number,
        readonly farmId: number,
        readonly workerId: number,
        readonly bus: number,
        readonly brand: string | null,
        readonly isMonitoringCore: boolean,
        readonly maximumCoreTemperature: number,
        readonly initialCoreClock: number,
        readonly maximumCoreClock: number,
        readonly memorieTemperature: number,
        readonly isMonitoringMemorie: boolean,
        readonly maximumMemorieTemperature: number,
        readonly initialMemorieClock: number,
        readonly maximumMemorieClock: number,
        readonly createdAt: Date,
        readonly restored: boolean = false,
    ) {
        accountId = Number(accountId) || 0;
        farmId = Number(farmId) || 0;
        workerId = Number(workerId) || 0;
        bus = Number(bus) || 0;
        brand = typeof brand == 'string' && brand ? brand : null;
        isMonitoringCore = !!isMonitoringCore;
        maximumCoreTemperature = Number(maximumCoreTemperature) || 0;
        initialCoreClock = Number(initialCoreClock) || 0;
        maximumCoreClock = Number(maximumCoreClock) || 0;
        memorieTemperature = Number(memorieTemperature) || 0;
        isMonitoringMemorie = !!isMonitoringMemorie;
        maximumMemorieTemperature = Number(maximumMemorieTemperature) || 0;
        initialMemorieClock = Number(initialMemorieClock) || 0;
        maximumMemorieClock = Number(maximumMemorieClock) || 0;
    }

    static create(data: CreateGpuData)
        : GpuData | GpuDataErrors {
        const gpuData = new GpuData(
            crypto.randomUUID(),
            data.accountId,
            data.farmId,
            data.workerId,
            data.bus,
            data.brand,
            data.isMonitoringCore,
            data.maximumCoreTemperature,
            data.initialCoreClock,
            data.maximumCoreClock,
            data.memorieTemperature,
            data.isMonitoringMemorie,
            data.maximumMemorieTemperature,
            data.initialMemorieClock,
            data.maximumMemorieClock,
            new Date(),
        );
        const errors: GpuDataErrors = gpuData.validate();
        if (errors.length) {
            return errors as GpuDataErrors;
        }
        return gpuData as GpuData;
    }

    static createDefault(data: CreateGpuData): GpuData {
        const gpuData = new GpuData(
            crypto.randomUUID(),
            data.accountId,
            data.farmId,
            data.workerId,
            data.bus,
            data.brand,
            data.isMonitoringCore,
            data.maximumCoreTemperature,
            data.initialCoreClock,
            data.maximumCoreClock,
            data.memorieTemperature,
            data.isMonitoringMemorie,
            data.maximumMemorieTemperature,
            data.initialMemorieClock,
            data.maximumMemorieClock,
            new Date(),
        );
        return gpuData as GpuData;
    }

    static createAll(
        data: Array<CreateGpuData>
    ): GpuDataResult {
        const success: Array<GpuData> = [];
        const errors: Array<GpuDataErrors> = [];

        for (let i = 0; i < data.length; i++) {
            const gpuData: GpuData | GpuDataErrors
                = GpuData.create(data[i]);

            if (GpuData.containErrors(gpuData)) {
                errors.push(gpuData);
                continue;
            }
            success.push(gpuData);
        }

        return { success, errors } as GpuDataResult;
    }

    static restore(
        data: RestoreGpuData,
    ): GpuData | GpuDataErrors {
        const gpuData = new GpuData(
            data.uuid,
            data.accountId,
            data.farmId,
            data.workerId,
            data.bus,
            null,
            data.isMonitoringCore,
            data.maximumCoreTemperature,
            data.initialCoreClock,
            data.maximumCoreClock,
            0,
            data.isMonitoringMemorie,
            data.maximumMemorieTemperature,
            data.initialMemorieClock,
            data.maximumMemorieClock,
            data.createdAt,
            true,
        );
        const errors: GpuDataErrors = gpuData.validate();
        if (errors.length) {
            return errors as GpuDataErrors;
        }
        return gpuData as GpuData;
    }

    static restoreAll(
        data: Array<RestoreGpuData>
    ): GpuDataResult {
        const success: Array<GpuData> = [];
        const errors: Array<GpuDataErrors> = [];

        for (let i = 0; i < data.length; i++) {
            const gpuData: GpuData | GpuDataErrors
                = GpuData.restore(data[i]);

            if (GpuData.containErrors(gpuData)) {
                errors.push(gpuData);
                continue;
            }
            success.push(gpuData);
        }

        return { success, errors } as GpuDataResult;
    }

    private validate(): GpuDataErrors {
        const errors: GpuDataErrors = [];

        if (!this.uuid || this.uuid.length != 36) {
            errors.push({ bus: this.bus, message: 'Invalid UUID' });
        }
        if (!this.accountId) {
            errors.push({ bus: this.bus, message: 'Invalid Hive Account ID' });
        }
        if (!this.farmId) {
            errors.push({ bus: this.bus, message: 'Invalid Farm ID' });
        }
        if (!this.workerId) {
            errors.push({ bus: this.bus, message: 'Invalid Worker ID' });
        }
        if (typeof this.bus != 'number') {
            errors.push({ bus: this.bus, message: 'Invalid Bus number' });
        }
        if (!(this.brand == 'nvidia' || this.brand == null && this.restored)) {
            errors.push({ bus: this.bus, message: 'Invalid GPU Brand' });
        }

        if (this.isMonitoringCore) {
            //EMPTY VALIDATIONS - CORE
            if (!this.maximumCoreTemperature) {
                errors.push({ bus: this.bus, message: 'Invalid Core Temperature Limit' });
            }
            if (!this.initialCoreClock) {
                errors.push({ bus: this.bus, message: 'Invalid Core Starts' });
            }
            if (!this.maximumCoreClock) {
                errors.push({ bus: this.bus, message: 'Invalid Core Limit' });
            }
        }

        //BUSINESS RULES - CORE
        if (this.initialCoreClock && this.initialCoreClock < 500) {
            errors.push({ bus: this.bus, message: 'Invalid Core Starts lower than 500' });
        }
        if (this.initialCoreClock && this.maximumCoreClock && this.initialCoreClock > this.maximumCoreClock) {
            errors.push({ bus: this.bus, message: 'Invalid Core Starts greater than Core Limit' });
        }

        if (this.isMonitoringMemorie) {
            //EMPTY VALIDATIONS - MEMORY
            if (!this.maximumMemorieTemperature) {
                errors.push({ bus: this.bus, message: 'Invalid Memory Temperature Limit' });
            }
            if (!this.initialMemorieClock) {
                errors.push({ bus: this.bus, message: 'Invalid Memory Starts' });
            }
            if (!this.maximumMemorieClock) {
                errors.push({ bus: this.bus, message: 'Invalid Memory Limit' });
            }
        }

        //BUSINESS RULES - MEMORY
        if (this.isMonitoringMemorie && !this.memorieTemperature && !this.restored) {
            errors.push({ bus: this.bus, message: 'Invalid Memory monitoring due no temperature provided' });
        }
        if (this.initialMemorieClock && this.maximumMemorieClock && this.initialMemorieClock > this.maximumMemorieClock) {
            errors.push({ bus: this.bus, message: 'Invalid Memory Starts greater than Memory Limit' });
        }

        if (!(this.createdAt instanceof Date) || this.createdAt.toString() == 'Invalid Date') {
            errors.push({ bus: this.bus, message: 'Invalid Created Date' });
        }

        return errors as GpuDataErrors;
    }

}