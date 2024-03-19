import { left, right, type Either } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import type DashboardApiInterface from "../dashboard/DashboardApiInterface";
import type UseCase from "./UseCase";

export default class StartMonitoring implements UseCase {

    constructor(
        private dashboardApi: DashboardApiInterface,
    ) { }

    async execute(input: StartMonitoringInput): StartMonitoringOutput {
        let { farmId, workerId } = input;

        const responseOrError = await this.dashboardApi
            .postWorker(farmId, workerId, { monitoring: true });
        if (responseOrError.isRight()) {
            return right("done");
        }

        const error = responseOrError.value;
        if (error instanceof ApplicationError) {
            return left(error);
        }
        return left(new ApplicationError("Error trying start monitoring, please try again."));
    }
}

export type StartMonitoringInput = {
    farmId: number, workerId: number
};

export type StartMonitoringOutput = Promise<
    Either<
        ApplicationError,
        "done"
    >
>;
