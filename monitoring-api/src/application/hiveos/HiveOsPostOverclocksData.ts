export default interface HiveOsPostOverclocksData {
    gpus: Array<{
        index: number,
        brand: string,
        core: number,
        memorie: number,
    }>
};