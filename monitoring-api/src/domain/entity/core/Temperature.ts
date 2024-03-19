enum TEMPERATURE_CONDITION {
    COLD = 'COLD',
    EQUAL = 'EQUAL',
    HOT = 'HOT'
}

export default class Temperature {

    private condition: TEMPERATURE_CONDITION;
    private absoluteDifference: number;

    constructor(
        private current: number,
        private maximum: number
    ) {
        const difference = this.maximum - this.current;
        const signal = Math.sign(difference);
        this.condition = signal == 0 ? TEMPERATURE_CONDITION.EQUAL : signal == 1 ? TEMPERATURE_CONDITION.COLD : TEMPERATURE_CONDITION.HOT;
        this.absoluteDifference = Math.abs(difference);
    }

    getCurrent(): number {
        return this.current;
    }

    difference(): number {
        return this.absoluteDifference;
    }

    isCold(): boolean {
        return this.condition == TEMPERATURE_CONDITION.COLD;
    }

    isEqual(): boolean {
        return this.condition == TEMPERATURE_CONDITION.EQUAL;
    }

    isHot(): boolean {
        return this.condition == TEMPERATURE_CONDITION.HOT;
    }

    isTooHot(): boolean {
        return this.condition == TEMPERATURE_CONDITION.HOT && this.absoluteDifference > 3;
    }

}