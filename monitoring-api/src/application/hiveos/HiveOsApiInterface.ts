import { Either } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import HiveOsPostOverclocksData from "./HiveOsPostOverclocksData";
import HiveOsWorkerData from "./HiveOsWorkerData";

export default interface HiveOsApiInterface {

    getWorker(token: string, farmId: number, workerId: number): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            HiveOsWorkerData
        >
    >;

    postOverclocks(
        token: string, farmId: number, workerId: number, overclocks: HiveOsPostOverclocksData
    ): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError,
            "done"
        >
    >;

}
