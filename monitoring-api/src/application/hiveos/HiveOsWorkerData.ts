export default interface HiveOsWorkerData {
    farm_id: number,
    worker_id: number,
    stats: { online: boolean, miner_start_time: number },
    gpu_stats: Array<
        { bus_number: number, temp: number, memtemp: number }
    >,
    gpu_info: Array<
        { bus_number: number, brand: string, index: number }
    >,
    overclocks: {
        [key: string]: Array<{ core_clock: string, mem_clock: string }>
    }
    gpus: Array<{
        index: number,
        bus_number: number,
        brand: string,
        temp: number,
        core_clock: string,
        memtemp: number
        mem_clock: string
    }>
};