import type UseCase from "./UseCase";
import { left, right, type Either } from "../../domain/shared/Either";
import { UnauthorizedHttpError } from "../http/HttpClient";
import ApplicationError from "../error/ApplicationError";
import type DashboardApiInterface from "../dashboard/DashboardApiInterface";
import type AccountLocalStorageInterface from "../localstorage/AccountLocalStorageInterface";

export default class Login implements UseCase {

    constructor(
        private dashboardApi: DashboardApiInterface,
        private accountLocalStorage: AccountLocalStorageInterface
    ) { }

    async execute(input: LoginInput): LoginOutput {
        let { token } = input;

        const responseOrError = await this.dashboardApi.postAccount(token);
        if (responseOrError.isRight()) {
            const response = responseOrError.value;
            const { accountId } = response;
            this.accountLocalStorage.add(accountId, token);
            return right("done");
        }

        const error = responseOrError.value;
        if (error instanceof UnauthorizedHttpError) {
            return left(new ApplicationError("Unauthorized, make sure your token is active on Hive OS"));
        }
        return left(new ApplicationError("Something went wrong trying login, please try again"));
    }
}

export type LoginInput = {
    token: string
};

export type LoginOutput = Promise<
    Either<
        UnauthorizedHttpError | ApplicationError,
        "done"
    >
>;
