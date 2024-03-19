import ApplicationError from "../../application/error/ApplicationError";
import HiveOsWorkerData from "../../application/hiveos/HiveOsWorkerData";
import { Either, left, right } from "../../domain/shared/Either";

export default class HiveOsWorker {

    readonly id: number;
    readonly name: string;

    constructor(
        readonly data: HiveOsWorkerData
    ) {
        this.id = data.worker_id;
        this.name = data.name;
    }

    isOnline(): boolean {
        return this.data.stats && this.data.stats.online == true;
    }

    getGpu(bus: number): Either<
        ApplicationError,
        { brand: string, memtemp: number }
    > {
        const info: any = this.data.gpu_info.find((info: any) => info.bus_number == bus);
        const stats: any = this.data.gpu_stats.find((stats: any) => stats.bus_number == bus);
        if (!info) {
            return left(
                new ApplicationError(
                    `GPU info not found on bus #${bus}`,
                    `GPU info not found on bus #${bus}`
                )
            );
        }
        if (!stats) {
            return left(
                new ApplicationError(
                    `GPU stats not found on bus #${bus}`,
                    `GPU stats not found on bus #${bus}`
                )
            );
        }
        return right({ brand: info.brand, memtemp: stats.memtemp });
    }

}