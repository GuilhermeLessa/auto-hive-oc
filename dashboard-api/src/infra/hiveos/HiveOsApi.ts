import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../../application/http/HttpClient";
import HttpClient from "../../application/http/HttpClient";
import HiveOsWorkerParser from "./HiveOsWorkerDataParser";
import HiveOsWorkerData from "../../application/hiveos/HiveOsWorkerData";
import HiveOsApiInterface from "../../application/hiveos/HiveOsApiInterface";
import ApplicationError from "../../application/error/ApplicationError";

export default class HiveOsApi implements HiveOsApiInterface {

    constructor(
        private httpClient: HttpClient
    ) { }

    async getAccount(token: string): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            { account: { id: number } }
        >
    > {
        const responseOrError = await this.httpClient.get(
            "/account",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }

        const response = responseOrError.value;
        const { id } = response.data;
        if (!id) {
            return left(new ApplicationError('Invalid account data'));
        }

        return right({ account: { id } });
    };

    async getFarms(token: string): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            { farms: Array<{ id: number, name: string }> }
        >
    > {
        const responseOrError = await this.httpClient.get(
            "/farms",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }

        const response = responseOrError.value;
        const farms = response.data.data;
        if (!Array.isArray(farms)) {
            return left(new ApplicationError('Invalid farms data'));
        }
        if (!farms.length) {
            return right({ farms: [] });
        }
        const valid = farms.every(farm => farm.id && farm.name);
        if (!valid) {
            return left(new ApplicationError('Invalid farms data'));
        }

        return right({
            farms: farms.map(farm => ({
                id: farm.id,
                name: farm.name,
            }))
        });
    }

    async getWorkers(token: string, farmId: number): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            { workers: Array<{ id: number, name: string }> }
        >
    > {
        const responseOrError = await this.httpClient.get(
            `/farms/${farmId}/workers2`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }

        const response = responseOrError.value;
        const workers = response.data.data;
        if (!Array.isArray(workers)) {
            return left(new ApplicationError('Invalid workers data'));
        }
        if (!workers.length) {
            return right({ workers: [] });
        }
        const valid = workers.every(worker => worker.id && worker.name);
        if (!valid) {
            return left(new ApplicationError('Invalid workers data'));
        }

        return right({
            workers: workers.map(workers => ({
                id: workers.id,
                name: workers.name,
            }))
        });
    }

    async getWorker(token: string, accountId: number, farmId: number, workerId: number): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            HiveOsWorkerData
        >
    > {
        const responseOrError = await this.httpClient.get(
            `/farms/${farmId}/workers/${workerId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }

        const response = responseOrError.value;
        let hiveOsWorkerData = response.data;
        hiveOsWorkerData.account_id = accountId;
        const parser = new HiveOsWorkerParser(hiveOsWorkerData);
        const data = parser.getData();
        if (!data) {
            return left(new ApplicationError('Invalid worker data'));
        }
        return right(data!);
    }

}
