import type AccountLocalStorageInterface from "../localstorage/AccountLocalStorageInterface";
import ApplicationError from "../error/ApplicationError";
import { right, type Either, left } from "@/domain/shared/Either";
import type UseCase from "./UseCase";

export default class CheckLogin implements UseCase {

    constructor(
        private accountLocalStorage: AccountLocalStorageInterface
    ) { }

    execute(input: CheckLoginInput): CheckLoginOutput {
        const accountDataOrError = this.accountLocalStorage.get();
        if (accountDataOrError.isRight()) {
            const accountData = accountDataOrError.value;
            const { accountId, token } = accountData;
            return right({ accountId, token });
        }

        return left(new ApplicationError("Error trying check login authentication"));
    }
}

export type CheckLoginInput = any;

export type CheckLoginOutput = Either<
    ApplicationError,
    { accountId: number, token: string }
>;
