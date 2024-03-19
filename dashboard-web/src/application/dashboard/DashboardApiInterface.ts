import type { Either } from "@/domain/shared/Either";
import type ApplicationError from "../error/ApplicationError";
import type { UnauthorizedHttpError } from "../http/HttpClient";

export default interface DashboardApiInterface {

    setToken(token: string): void;

    setAccountId(accountId: number): void;

    getFarms(): Promise<
        Either<
            ApplicationError,
            Array<{
                id: string,
                name: string,
            }>
        >
    >;

    getWorkers(farmId: number): Promise<
        Either<
            ApplicationError,
            Array<{
                id: string,
                name: string,
            }>
        >
    >;

    getWorker(farmId: number, workerId: number): Promise<
        Either<
            ApplicationError,
            {
                id: number,
                name: string,
                monitoring: boolean,
                online: boolean,
                gpus: Array<{
                    isMonitoringCore: boolean,
                    maximumCoreTemperature: number,
                    initialCoreClock: number,
                    maximumCoreClock: number,
                    isMonitoringMemorie: boolean,
                    maximumMemorieTemperature: number,
                    initialMemorieClock: number,
                    maximumMemorieClock: number
                }>
            }
        >
    >;

    postWorker(farmId: number, workerId: number, worker: { monitoring: boolean }): Promise<
        Either<
            ApplicationError,
            "done"
        >
    >;

    postGpus(
        farmId: number,
        workerId: number,
        gpus: Array<{
            bus: number,
            isMonitoringCore: boolean,
            maximumCoreTemperature: number,
            initialCoreClock: number,
            maximumCoreClock: number,
            isMonitoringMemorie: boolean,
            maximumMemorieTemperature: number,
            initialMemorieClock: number,
            maximumMemorieClock: number
        }>
    ): Promise<
        Either<
            ApplicationError,
            "done"
        >
    >;

    postAccount(token: string): Promise<
        Either<
            UnauthorizedHttpError | ApplicationError,
            { accountId: number }
        >
    >;

}