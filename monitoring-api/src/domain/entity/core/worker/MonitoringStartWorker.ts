import HiveOsWorkerData from "../../../../application/hiveos/HiveOsWorkerData";
import HiveOsPostOverclocksData from "../../../../application/hiveos/HiveOsPostOverclocksData";
import Worker from "./Worker";
import GpuData from "../../data/GpuData";
import Gpu from "../gpu/Gpu";

export default class MonitoringStartWorker extends Worker {

    constructor(
        hiveOsWorkerData: HiveOsWorkerData,
        gpusData: Array<GpuData>,
    ) {
        super(hiveOsWorkerData, gpusData);
    }

    getPostOverclocksData(): HiveOsPostOverclocksData {
        const gpus = this.getGpus()
            .map((gpu: Gpu) => {
                let core = 0;
                if (
                    gpu.core.isMonitoring &&
                    gpu.core.temperature > 0 &&
                    gpu.core.initialClock
                ) {
                    core = gpu.core.initialClock;
                }
                let memorie = 0;
                if (
                    gpu.memorie.isMonitoring &&
                    gpu.memorie.temperature > 0 &&
                    gpu.memorie.initialClock
                ) {
                    memorie = gpu.memorie.initialClock;
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