
export default class HiveOsWorkerDataValidator {

    private valid: boolean = false;

    constructor(data: any) {
        this.validate(data);
    }

    isValid(): boolean {
        return this.valid;
    }

    private validate(data: any): void {
        if (!(this.isNumber(data.farm_id) && data.farm_id)) {
            return;
        }
        if (!(this.isNumber(data.id) && data.id)) {
            return;
        }
        if (!(this.isString(data.name) && data.name)) {
            return;
        }
        if (!this.isObject(data.stats)) {
            return;
        }
        if (!this.isBoolean(data.stats.online)) {
            return;
        }
        if (!this.isNumber(data.stats.miner_start_time)) {
            return;
        }
        if (data.gpu_stats && !Array.isArray(data.gpu_stats)) {
            return;
        }
        if (data.gpu_info && !Array.isArray(data.gpu_info)) {
            return;
        }
        if (this.exist(data.overclock) && !this.isObject(data.overclock)) {
            return;
        }
        if (data.gpu_stats && data.gpu_stats.length) {
            const valid = data.gpu_stats.every((stat: any) =>
                this.isNumber(stat.bus_number) && stat.bus_number &&
                this.isNumber(stat.temp) &&
                (this.isNumber(stat.memtemp) || this.nonExist(stat.memtemp))
            );
            if (!valid) {
                return;
            }
        }
        if (data.gpu_info && data.gpu_info.length) {
            const valid = data.gpu_info.every((info: any) =>
                this.isNumber(info.bus_number) &&
                (this.isNumber(info.index) || this.nonExist(info.index)) &&
                this.isString(info.brand) && info.brand
            );
            if (!valid) {
                return;
            }
        }
        if (
            this.exist(data.overclock) &&
            this.exist(data.overclock.nvidia) &&
            !this.isObject(data.overclock.nvidia)
        ) {
            return;
        }
        if (
            this.exist(data.overclock) &&
            this.exist(data.overclock.nvidia) &&
            this.isObject(data.overclock) &&
            this.isObject(data.overclock.nvidia)
        ) {
            if (
                this.exist(data.overclock.nvidia.core_clock) &&
                !this.isString(data.overclock.nvidia.core_clock)
            ) {
                return;
            }
            if (
                this.exist(data.overclock.nvidia.mem_clock) &&
                !this.isString(data.overclock.nvidia.mem_clock)
            ) {
                return;
            }
        }
        this.valid = true;
    }

    private exist(attribute: any): boolean {
        return typeof attribute != "undefined";
    }

    private nonExist(attribute: any): boolean {
        return typeof attribute == "undefined";
    }

    private isNumber(attribute: any): boolean {
        return typeof attribute == "number";
    }

    private isString(attribute: any): boolean {
        return typeof attribute == "string";
    }

    private isObject(attribute: any): boolean {
        return typeof attribute == "object" && !Array.isArray(attribute) && attribute !== null;
    }

    private isBoolean(attribute: any): boolean {
        return typeof attribute == "boolean";
    }

}