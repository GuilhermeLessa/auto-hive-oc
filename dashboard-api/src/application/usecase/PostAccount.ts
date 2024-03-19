import UseCase from "./UseCase";
import HiveOsApiInterface from "../hiveos/HiveOsApiInterface";
import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";
import AccountData from "../../domain/entity/data/AccountData";
import AccountRepository from "../repository/AccountRepository";
import GenericRepositoryError from "../repository/GenericRepositoryError";

export default class PostAccount implements UseCase {

    constructor(
        private hiveOsApi: HiveOsApiInterface,
        private accountRepository: AccountRepository
    ) { }

    async execute(input: PostAccountInput): PostAccountOutput {
        const { token } = input;

        const responseOrError = await this.hiveOsApi.getAccount(token);
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }

        const response = responseOrError.value;
        const { account } = response;

        const accountDataFoundOrError = await this.accountRepository.findOne(token, account.id);
        if (accountDataFoundOrError.isLeft()) {
            const error = accountDataFoundOrError.value;
            return left(error);
        }

        const result = accountDataFoundOrError.value;
        if (result instanceof AccountData) {
            const accountData = result;
            return right(accountData);
        }

        const accountData = AccountData.create(token, account.id);
        const accountDataInsertedOrError = await this.accountRepository.insertOne(accountData);
        if (accountDataInsertedOrError.isLeft()) {
            const error = accountDataInsertedOrError.value;
            return left(error);
        }

        return right(accountData);
    }

}

export type PostAccountInput = {
    token: string
};

export type PostAccountOutput = Promise<
    Either<
        GenericHttpError | UnauthorizedHttpError | ApplicationError | GenericRepositoryError,
        AccountData
    >
>;
