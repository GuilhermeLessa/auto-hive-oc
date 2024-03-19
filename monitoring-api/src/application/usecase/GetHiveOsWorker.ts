import UseCase from "./UseCase";
import HiveOsApiInterface from "../hiveos/HiveOsApiInterface";
import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";
import HiveOsWorker from "../../infra/hiveos/HiveOsWorker";

export default class GetHiveOsWorker implements UseCase {

    constructor(
        private hiveOsApi: HiveOsApiInterface,
    ) { }

    async execute(input: GetHiveOSWorkerInput): GetHiveOSWorkerOutput {
        const { token, farmId, workerId } = input;

        const hiveOsWorkerDataOrError = await this.hiveOsApi.getWorker(token, farmId, workerId);
        if (hiveOsWorkerDataOrError.isLeft()) {
            const error = hiveOsWorkerDataOrError.value;
            return left(error);
        }

        const hiveOsWorkerData = hiveOsWorkerDataOrError.value;
        const hiveOsWorker = new HiveOsWorker(hiveOsWorkerData);
        return right(hiveOsWorker);
    }

}

export type GetHiveOSWorkerInput = {
    token: string, farmId: number, workerId: number
};

export type GetHiveOSWorkerOutput = Promise<
    Either<
        GenericHttpError | UnauthorizedHttpError | ApplicationError,
        HiveOsWorker
    >
>;
