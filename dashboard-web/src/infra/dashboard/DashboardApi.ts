import type DashboardApiInterface from "@/application/dashboard/DashboardApiInterface";
import ApplicationError from "@/application/error/ApplicationError";
import type HttpClient from "@/application/http/HttpClient";
import { UnauthorizedHttpError } from "@/application/http/HttpClient";
import { left, right, type Either } from "@/domain/shared/Either";

export default class DashboardApi implements DashboardApiInterface {

    private token!: string;
    private accountId!: number;

    constructor(
        private httpClient: HttpClient
    ) { }

    setToken(token: string): void {
        this.token = token;
    }

    setAccountId(accountId: number): void {
        this.accountId = accountId;
    }

    async getFarms(): Promise<
        Either<
            ApplicationError,
            Array<{
                id: string,
                name: string,
            }>
        >
    > {
        const responseOrError = await this.httpClient
            .get("/farms", { params: { token: this.token } });
        if (responseOrError.isRight()) {
            const response = responseOrError.value;
            const farms = response.data.farms.map((farm: any) => ({
                id: farm.id,
                name: farm.name
            }));
            return right(farms);
        }
        return left(new ApplicationError("Error trying get farms data."));
    }

    async getWorkers(farmId: number): Promise<
        Either<
            ApplicationError,
            Array<{
                id: string,
                name: string,
            }>
        >
    > {
        const responseOrError = await this.httpClient
            .get(`/farms/${farmId}/workers`, { params: { token: this.token } });
        if (responseOrError.isRight()) {
            const response = responseOrError.value;
            const workers = response.data.workers.map((worker: any) => ({
                id: worker.id,
                name: worker.name
            }));
            return right(workers);
        }
        return left(new ApplicationError("Error trying get workers data."));
    }

    async getWorker(farmId: number, workerId: number): Promise<
        Either<
            ApplicationError,
            {
                id: number,
                name: string,
                monitoring: boolean,
                online: boolean,
                gpus: Array<{
                    bus: number,
                    brand: string,
                    shortName: string,
                    coreClock: string,
                    coreTemperature: number,
                    isMonitoringCore: boolean,
                    maximumCoreTemperature: number,
                    initialCoreClock: number,
                    maximumCoreClock: number,
                    memorieClock: string,
                    memorieTemperature: number,
                    isMonitoringMemorie: boolean,
                    maximumMemorieTemperature: number,
                    initialMemorieClock: number,
                    maximumMemorieClock: number
                }>
            }
        >
    > {
        const responseOrError = await this.httpClient.get(
            `/farms/${farmId}/workers/${workerId}`,
            { params: { token: this.token, accountId: this.accountId } }
        );
        if (responseOrError.isRight()) {
            const response = responseOrError.value;
            const { id, name, monitoring, online, gpus } = response.data;
            const worker = {
                id,
                name,
                monitoring,
                online,
                gpus: gpus.map((gpu: any) => ({
                    bus: gpu.bus,
                    brand: gpu.brand,
                    shortName: gpu.shortName,
                    coreClock: gpu.coreClock,
                    coreTemperature: gpu.coreTemperature,
                    isMonitoringCore: gpu.isMonitoringCore,
                    maximumCoreTemperature: gpu.maximumCoreTemperature,
                    initialCoreClock: gpu.initialCoreClock,
                    maximumCoreClock: gpu.maximumCoreClock,
                    memorieClock: gpu.memorieClock,
                    memorieTemperature: gpu.memorieTemperature,
                    isMonitoringMemorie: gpu.isMonitoringMemorie,
                    maximumMemorieTemperature: gpu.maximumMemorieTemperature,
                    initialMemorieClock: gpu.initialMemorieClock,
                    maximumMemorieClock: gpu.maximumMemorieClock,
                })),
            };
            return right(worker);
        }
        return left(new ApplicationError("Error trying get worker data."));
    }

    async postWorker(farmId: number, workerId: number, worker: { monitoring: boolean }): Promise<
        Either<
            ApplicationError,
            "done"
        >
    > {
        const responseOrError = await this.httpClient.post(
            `/farms/${farmId}/workers/${workerId}`,
            { params: { token: this.token, accountId: this.accountId } },
            worker
        );
        if (responseOrError.isRight()) {
            return right("done");
        }
        const error = responseOrError.value;
        if (error instanceof ApplicationError) {
            return left(error);
        }
        if (worker.monitoring) {
            return left(new ApplicationError("Error trying start monitoring."));
        }
        return left(new ApplicationError("Error trying stop monitoring."));
    }

    async postGpus(
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
    > {
        const responseOrError = await this.httpClient.post(
            `/farms/${farmId}/workers/${workerId}/gpus`,
            { params: { token: this.token, accountId: this.accountId } },
            { gpus }
        );
        if (responseOrError.isRight()) {
            return right("done");
        }
        const error = responseOrError.value;
        if (error instanceof ApplicationError) {
            return left(error);
        }
        return left(new ApplicationError("Error trying save gpu settings."));
    }

    async postAccount(token: string): Promise<
        Either<
            UnauthorizedHttpError | ApplicationError,
            { accountId: number }
        >
    > {
        const responseOrError = await this.httpClient.post(
            `/account`,
            {},
            { token }
        );
        if (responseOrError.isRight()) {
            const response = responseOrError.value;
            const { accountId } = response.data;
            return right({ accountId });
        }
        const error = responseOrError.value;
        if (error instanceof UnauthorizedHttpError) {
            return left(error);
        }
        return left(new ApplicationError("Error trying post account."));
    }

}
