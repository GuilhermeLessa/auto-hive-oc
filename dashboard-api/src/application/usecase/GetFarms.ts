import UseCase from "./UseCase";
import HiveOsApiInterface from "../hiveos/HiveOsApiInterface";
import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";

export default class GetFarms implements UseCase {

    constructor(
        private hiveOsApi: HiveOsApiInterface,
    ) { }

    async execute(input: GetFarmsInput): GetFarmsOutput {
        const { token } = input;

        const farmsDataOrError = await this.hiveOsApi.getFarms(token);
        if (farmsDataOrError.isRight()) {
            const farms = farmsDataOrError.value;
            return right(farms);
        }

        const error = farmsDataOrError.value;
        return left(error);
    }

}

export type GetFarmsInput = {
    token: string
};

export type GetFarmsOutput = Promise<
    Either<
        GenericHttpError | UnauthorizedHttpError | ApplicationError,
        { farms: Array<{ id: number, name: string }> }
    >
>;
