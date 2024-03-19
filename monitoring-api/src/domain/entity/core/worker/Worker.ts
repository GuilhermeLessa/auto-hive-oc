import Gpu from "../gpu/Gpu";
import GpuData from "../../data/GpuData";
import HiveOsWorkerData from "../../../../application/hiveos/HiveOsWorkerData";

export default abstract class Worker {

    protected readonly id: number;
    private gpus: Array<Gpu> = [];
    private hasTemperatureEmergency: boolean = false;

    constructor(
        private hiveOsWorkerData: HiveOsWorkerData,
        private gpusData: Array<GpuData>,
    ) {
        this.id = this.hiveOsWorkerData.worker_id;
        this.loadGpus();
        this.setHasTemperatureEmergency();
    }

    protected getHasTemperatureEmergency(): boolean {
        return this.hasTemperatureEmergency;
    }

    protected getGpus(): Array<Gpu> {
        return this.gpus;
    }

    protected tunneOverclock(): void {
        for (let i = 0; i < this.gpus.length; i++) {
            this.gpus[i].tunneOverclock();
        }
    }

    private loadGpus(): void {
        let gpus: Array<Gpu> = [];

        for (let i = 0; i < this.hiveOsWorkerData.gpus.length; i++) {
            const gpuWorkerData = this.hiveOsWorkerData.gpus[i];
            const gpuData = this.findGpuData(gpuWorkerData.bus_number);
            if (!gpuData) {
                continue;
            }
            const gpu = new Gpu(
                gpuWorkerData.index,
                gpuWorkerData.brand,
                gpuWorkerData.temp,
                gpuWorkerData.core_clock,
                gpuWorkerData.memtemp,
                gpuWorkerData.mem_clock,
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

    private setHasTemperatureEmergency() {
        this.hasTemperatureEmergency
            = this.gpus.some(gpu => gpu.hasTemperatureEmergency());
    }

}