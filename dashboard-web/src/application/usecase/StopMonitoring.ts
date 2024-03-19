import {  left, right, type Either } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import type DashboardApiInterface from "../dashboard/DashboardApiInterface";
import type UseCase from "./UseCase";

export default class StopMonitoring implements UseCase {

    constructor(
        private dashboardApi: DashboardApiInterface,
    ) { }

    async execute(input: StopMonitoringInput): StopMonitoringOutput {
        let { farmId, workerId } = input;

        const responseOrError = await this.dashboardApi
            .postWorker(farmId, workerId, { monitoring: false });
        if (responseOrError.isRight()) {
            return right("done");
        }

        const error = responseOrError.value;
        if (error instanceof ApplicationError) {
            return left(error);
        }
        return left(new ApplicationError("Error trying stop monitoring, please try again."));
    }
}

export type StopMonitoringInput = {
    farmId: number, workerId: number
};

export type StopMonitoringOutput = Promise<
    Either<
        ApplicationError,
        "done"
    >
>;
