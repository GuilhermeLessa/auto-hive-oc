import { Either } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import HiveOsWorkerData from "./HiveOsWorkerData";

export default interface HiveOsApiInterface {

    getAccount(token: string): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            { account: { id: number } }
        >
    >;

    getFarms(token: string): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            { farms: Array<{ id: number, name: string }> }
        >
    >;

    getWorkers(token: string, farmId: number): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            { workers: Array<{ id: number, name: string }> }
        >
    >;

    getWorker(token: string, accountId: number, farmId: number, workerId: number): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            HiveOsWorkerData
        >
    >;

}
