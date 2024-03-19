import GpuComponent from "./GpuComponent";

export default class GpuCore extends GpuComponent {

    constructor(
        readonly isMonitoring: boolean,
        clock: string,
        initialClock: number,
        maximumClock: number,
        temperature: number,
        maximumTemperature: number,
    ) {
        super(
            isMonitoring,
            clock,
            initialClock,
            maximumClock,
            temperature,
            maximumTemperature,
        );
    }

}