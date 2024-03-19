import UseCase from "./UseCase";
import HiveOsApiInterface from "../hiveos/HiveOsApiInterface";
import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";

export default class GetWorkers implements UseCase {

    constructor(
        private hiveOsApi: HiveOsApiInterface,
    ) { }

    async execute(input: GetWorkersInput): GetWorkersOutput {
        const { token, farmId } = input;

        const workersDataOrError = await this.hiveOsApi.getWorkers(token, farmId);
        if (workersDataOrError.isRight()) {
            const workers = workersDataOrError.value;
            return right(workers);
        }

        const error = workersDataOrError.value;
        return left(error);
    }

}

export type GetWorkersInput = {
    token: string, farmId: number
};

export type GetWorkersOutput = Promise<
    Either<
        GenericHttpError | UnauthorizedHttpError | ApplicationError,
        { workers: Array<{ id: number, name: string }> }
    >
>;
