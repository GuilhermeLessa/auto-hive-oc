import GpuCore from "./GpuCore";
import GpuMemorie from "./GpuMemorie";
import GpuData from "../../data/GpuData";

export default class Gpu {

    readonly core: GpuCore;
    readonly memorie: GpuMemorie;

    constructor(
        readonly index: number,
        readonly brand: string,
        coreTemperature: number,
        coreClock: string,
        memorieTemperature: number,
        memorieClock: string,
        gpuData: GpuData,
    ) {
        this.core = new GpuCore(
            gpuData.isMonitoringCore,
            coreClock,
            gpuData.initialCoreClock,
            gpuData.maximumCoreClock,
            coreTemperature,
            gpuData.maximumCoreTemperature,
        );
        this.memorie = new GpuMemorie(
            gpuData.isMonitoringMemorie,
            memorieClock,
            gpuData.initialMemorieClock,
            gpuData.maximumMemorieClock,
            memorieTemperature,
            gpuData.maximumMemorieTemperature,
        );
    }

    tunneOverclock(): void {
        this.core.tunneOverclock();
        this.memorie.tunneOverclock();
    }

    hasTemperatureEmergency(): boolean {
        return this.core.hasTemperatureEmergency()
            || this.memorie.hasTemperatureEmergency();
    }

}