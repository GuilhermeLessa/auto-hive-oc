import Gpu from "../gpu/Gpu";
import GpuData from "../../data/GpuData";
import HiveOsWorkerData from "../../../../application/hiveos/HiveOsWorkerData";
import WorkerData from "../../data/WorkerData";

export default abstract class Worker {

    readonly isMonitoring: boolean;
    private gpus: Array<Gpu> = [];

    constructor(
        private hiveOsWorkerData: HiveOsWorkerData,
        workerData: WorkerData,
        private gpusData: Array<GpuData>,
    ) {
        this.isMonitoring = workerData.isMonitoring;
        this.loadGpus();
    }

    protected getGpus(): Array<Gpu> {
        return this.gpus;
    }

    private loadGpus(): void {
        let gpus: Array<Gpu> = [];

        for (let i = 0; i < this.hiveOsWorkerData.gpus.length; i++) {
            const hiveOsGpuData = this.hiveOsWorkerData.gpus[i];
            let gpuData = this.findGpuData(hiveOsGpuData.bus_number);
            if (!gpuData) {
                gpuData = this.getDefaultGpuData(
                    hiveOsGpuData.bus_number,
                    hiveOsGpuData.brand,
                    hiveOsGpuData.memtemp
                );
            }
            const gpu = new Gpu(
                hiveOsGpuData.index,
                hiveOsGpuData.bus_number,
                hiveOsGpuData.brand,
                hiveOsGpuData.short_name,
                hiveOsGpuData.temp,
                hiveOsGpuData.core_clock,
                hiveOsGpuData.memtemp,
                hiveOsGpuData.mem_clock,
                gpuData,
            );
            gpus.push(gpu);
        }

        this.gpus = gpus;
    }

    private findGpuData(bus: number): GpuData | undefined {
        return this.gpusData
            .find((gpuData: GpuData) => gpuData.bus == bus);
    }

    private getDefaultGpuData(bus: number, brand: string, memorieTemperature: number): GpuData {
        const gpuData = GpuData.createDefault({
            accountId: this.hiveOsWorkerData.account_id,
            farmId: this.hiveOsWorkerData.farm_id,
            workerId: this.hiveOsWorkerData.worker_id,
            bus,
            brand,
            isMonitoringCore: false,
            maximumCoreTemperature: 0,
            initialCoreClock: 0,
            maximumCoreClock: 0,
            memorieTemperature,
            isMonitoringMemorie: false,
            maximumMemorieTemperature: 0,
            initialMemorieClock: 0,
            maximumMemorieClock: 0
        });
        return gpuData;
    }

}