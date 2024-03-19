import HiveOsWorkerData from "../../../../application/hiveos/HiveOsWorkerData";
import HiveOsPostOverclocksData from "../../../../application/hiveos/HiveOsPostOverclocksData";
import Worker from "./Worker";
import GpuData from "../../data/GpuData";
import Gpu from "../gpu/Gpu";

export default class MonitoringCheckWorker extends Worker {

    constructor(
        hiveOsWorkerData: HiveOsWorkerData,
        gpusData: Array<GpuData>,
    ) {
        super(hiveOsWorkerData, gpusData);
    }

    tunneOverclock(): void {
        this.tunneOverclock();
    }

    getHasTemperatureEmergency(): boolean {
        return this.getHasTemperatureEmergency();
    }

    getPostOverclocksData(): HiveOsPostOverclocksData {
        const gpus = this.getGpus()
            .map((gpu: Gpu) => {
                let core = 0;
                if (
                    gpu.core.isMonitoring &&
                    gpu.core.temperature > 0 &&
                    gpu.core.hasClockChanged() &&
                    gpu.core.getClock()
                ) {
                    core = parseInt(gpu.core.getClock());
                }
                let memorie = 0;
                if (
                    gpu.memorie.isMonitoring &&
                    gpu.memorie.temperature > 0 &&
                    gpu.memorie.hasClockChanged() &&
                    gpu.memorie.getClock()
                ) {
                    memorie = parseInt(gpu.memorie.getClock());
                }
                return {
                    workerId: this.id,
                    index: gpu.index,
                    brand: gpu.brand,
                    core,
                    memorie
                };
            })
            .filter((gpu: any) => gpu.core || gpu.memorie);
        return { gpus };
    }

}