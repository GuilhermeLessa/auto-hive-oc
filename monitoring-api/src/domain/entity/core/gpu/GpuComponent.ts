import Functions from "../../../shared/Functions";
import OverclockCalculator from "../OverclockCalculator";
import Temperature from "../Temperature";

interface GpuComponentInterface {
    readonly isMonitoring: boolean;
    readonly initialClock: number;
    readonly maximumClock: number;
    readonly temperature: number;
    getClock(): string;
    hasTemperatureEmergency(): boolean;
    tunneOverclock(): void;
    hasClockChanged(): boolean;
}

export default abstract class GpuComponent implements GpuComponentInterface {

    private _temperature: Temperature | undefined;
    private clockHasChanged: boolean = false;

    constructor(
        readonly isMonitoring: boolean,
        private clock: string,
        readonly initialClock: number,
        readonly maximumClock: number,
        readonly temperature: number,
        maximumTemperature: number,
    ) {
        this.loadTemperature(temperature, maximumTemperature);
    }

    getClock(): string {
        return this.clock;
    }

    hasTemperatureEmergency(): boolean {
        if (
            this.isMonitoring &&
            this._temperature &&
            this._temperature.isTooHot()
        ) {
            return true;
        }
        return false;
    }

    tunneOverclock(): void {
        if (!this.isMonitoring) {
            return;
        }
        if (!this.temperature) {
            return;
        }
        const clock = this.getTunnableClock();
        const tunnedClock = this.tunneClock(clock);
        if (tunnedClock == clock) {
            return;
        }
        this.clock = tunnedClock.toString();
        this.clockHasChanged = true;
    }

    hasClockChanged(): boolean {
        return this.clockHasChanged;
    }

    private loadTemperature(temperature: number, maximumTemperature: number): void {
        if (!(temperature && maximumTemperature)) {
            return;
        }
        this._temperature = new Temperature(temperature, maximumTemperature);
    }

    private getTunnableClock(): number {
        if (Functions.isNum(this.clock) && parseInt(this.clock) >= 500) {
            return parseInt(this.clock);
        }
        return this.initialClock;
    }

    private tunneClock(clock: number): number {
        let tunnedClock = OverclockCalculator.calculate(clock, this._temperature!);
        tunnedClock = tunnedClock > this.maximumClock ? this.maximumClock : tunnedClock;
        return tunnedClock < 500 ? 500 : tunnedClock; //while offset is not supported
    }

}