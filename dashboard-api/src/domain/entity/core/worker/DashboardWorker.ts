import HiveOsWorkerData from "../../../../application/hiveos/HiveOsWorkerData";
import Worker from "./Worker";
import GpuData from "../../data/GpuData";
import WorkerData from "../../data/WorkerData";
import Gpu from "../gpu/Gpu";

export default class DashboardWorker extends Worker {

    constructor(
        hiveOsWorkerData: HiveOsWorkerData,
        workerData: WorkerData,
        gpusData: Array<GpuData>,
    ) {
        super(hiveOsWorkerData, workerData, gpusData);
    }

    getDashboardGpuData(): {
        gpus: Array<{
            bus: number,
            brand: string,
            shortName: string,
            coreClock: string,
            coreTemperature: number,
            isMonitoringCore: boolean,
            maximumCoreTemperature: number,
            initialCoreClock: number,
            maximumCoreClock: number,
            memorieClock: string,
            memorieTemperature: number,
            isMonitoringMemorie: boolean,
            maximumMemorieTemperature: number,
            initialMemorieClock: number,
            maximumMemorieClock: number
        }>
    } {
        return {
            gpus: this.getGpus().map((gpu: Gpu) => {
                return {
                    bus: gpu.bus,
                    brand: gpu.brand,
                    shortName: gpu.shortName,
                    coreClock: gpu.core.clock,
                    coreTemperature: gpu.core.temperature,
                    isMonitoringCore: gpu.core.isMonitoring,
                    maximumCoreTemperature: gpu.core.maximumTemperature,
                    initialCoreClock: gpu.core.initialClock,
                    maximumCoreClock: gpu.core.maximumClock,
                    memorieClock: gpu.memorie.clock,
                    memorieTemperature: gpu.memorie.temperature,
                    isMonitoringMemorie: gpu.memorie.isMonitoring,
                    maximumMemorieTemperature: gpu.memorie.maximumTemperature,
                    initialMemorieClock: gpu.memorie.initialClock,
                    maximumMemorieClock: gpu.memorie.maximumClock,
                }
            })
        }
    }

}