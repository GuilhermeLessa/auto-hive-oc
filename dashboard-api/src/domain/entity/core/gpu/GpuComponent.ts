interface GpuComponentInterface {
    readonly isMonitoring: boolean;
    readonly clock: string;
    readonly initialClock: number;
    readonly maximumClock: number;
    readonly temperature: number;
}

export default abstract class GpuComponent implements GpuComponentInterface {

    constructor(
        readonly isMonitoring: boolean,
        readonly clock: string,
        readonly initialClock: number,
        readonly maximumClock: number,
        readonly temperature: number,
        readonly maximumTemperature: number,
    ) { }

}