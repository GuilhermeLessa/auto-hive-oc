import HiveOsWorkerData from "../../application/hiveos/HiveOsWorkerData";
import HiveOsWorkerDataValidator from "./HiveOsWorkerDataValidator";

export default class HiveOsWorkerDataParser {

    private data: HiveOsWorkerData | null = null;
    private validator!: HiveOsWorkerDataValidator;

    constructor(data: any) {
        this.validator = new HiveOsWorkerDataValidator(data);
        if (!this.validator.isValid()) {
            return;
        }
        this.parse(data);
    }

    getData(): HiveOsWorkerData | null {
        return this.data;
    }

    private parse(data: any): void {
        try {
            this.data = {
                farm_id: data.farm_id,
                worker_id: data.id,

                stats: {
                    online: data.stats.online,
                    miner_start_time: data.stats.miner_start_time,
                },

                //todo: validate when is offline
                gpu_stats: (this.orderByBus(data.gpu_stats))
                    .map((gpu: any) => ({
                        bus_number: gpu.bus_number,
                        temp: gpu.temp,
                        memtemp: gpu.memtemp || 0,
                    })),

                gpu_info: (this.orderByBus(data.gpu_info))
                    .map((gpu: any) => ({
                        bus_number: gpu.bus_number,
                        index: gpu.index,
                        brand: gpu.brand,
                    })),

                overclocks: {
                    nvidia: this.parseOverclocks(data.overclock, "nvidia"),
                },

                gpus: [],
            };

            this.data.gpus = this.data.gpu_stats
                .filter((gpu_stats: any) => gpu_stats.brand == 'nvidia')
                .map((gpu_stats: any) => {
                    const gpuInfo = this.data!.gpu_info
                        .find((gpu_info: any) => gpu_info.bus_number == gpu_stats.bus_number);
                    const gpuOverclock = this.getGpuOverclock(gpuInfo!.brand);
                    return {
                        ...gpuInfo,
                        ...gpu_stats,
                        ...gpuOverclock,
                    };
                });
        } catch (error) {
            console.log(error);
            this.data = null;
        }
    }

    private orderByBus(data: Array<any>): Array<any> {
        return data.sort((a: any, b: any) => a.bus_number - b.bus_number);
    }

    private getGpuOverclock(brand: string): { core_clock: string, mem_clock: string } {
        const overclock = this.data!.overclocks[brand].shift(); //its on right bus order
        if (!overclock) {
            return {
                core_clock: '0',
                mem_clock: '0'
            };
        }
        return overclock;
    }

    private parseOverclocks(
        overclocks: {
            [key: string]: { core_clock: string, mem_clock: string }
        },
        gpuBrand: string
    ): Array<{ core_clock: string, mem_clock: string }> {
        if (!(overclocks && overclocks[gpuBrand])) {
            return [];
        }

        let cores: Array<string> = [];
        if (overclocks[gpuBrand].core_clock) {
            cores = overclocks[gpuBrand].core_clock.split(" ");
        }

        let memories: Array<string> = [];
        if (overclocks[gpuBrand].mem_clock) {
            memories = overclocks[gpuBrand].mem_clock.split(" ");
        }

        let length = cores.length;
        if (memories.length > length) {
            length = memories.length;
        }

        const mapped: any = [];
        for (let i = 0; i < length; i++) {
            mapped.push({
                core_clock: cores[i] || '0',
                mem_clock: memories[i] || '0',
            });
        }
        return mapped;
    }

}