import Temperature from "./Temperature";

export default class OverclockCalculator {

    private static overclockRules = [
        { temperatureDifference: 8, changeValue: 100 },
        { temperatureDifference: 6, changeValue: 80 },
        { temperatureDifference: 4, changeValue: 50 },
        { temperatureDifference: 2, changeValue: 20 },
    ];

    static calculate(currentClock: number, temperature: Temperature): number {
        if (temperature.isEqual()) {
            return currentClock;
        }
        if (temperature.isCold()) {
            return currentClock += this.changeValue(temperature);
        }
        return currentClock -= this.changeValue(temperature);
    }

    private static changeValue(temperature: Temperature): number {
        const rule = this.overclockRules
            .find(rule => temperature.difference() >= rule.temperatureDifference);
        if (rule && rule.changeValue) {
            return rule.changeValue;
        }
        return 10;
    }

}