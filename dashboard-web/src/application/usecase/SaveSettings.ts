import type UseCase from "./UseCase";
import { left, right, type Either } from "../../domain/shared/Either";
import GpuData from "@/domain/entity/GpuData";
import type DashboardApiInterface from "../dashboard/DashboardApiInterface";
import type ApplicationError from "../error/ApplicationError";

export default class SaveSettings implements UseCase {

    constructor(
        private dashboardApi: DashboardApiInterface,
    ) { }

    async execute(input: SaveSettingsInput): SaveSettingsOutput {
        const { farmId, workerId, gpusData } = input;

        const saveOrError = await this.dashboardApi.postGpus(
            farmId,
            workerId,
            gpusData
        );

        if (saveOrError.isLeft()) {
            const error = saveOrError.value;
            return left(error);
        }

        return right("done");
    }
}

export type SaveSettingsInput = {
    farmId: number,
    workerId: number,
    gpusData: GpuData[]
};

export type SaveSettingsOutput = Promise<
    Either<
        ApplicationError,
        "done"
    >
>;