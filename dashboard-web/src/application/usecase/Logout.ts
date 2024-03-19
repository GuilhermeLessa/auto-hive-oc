import type UseCase from "./UseCase";
import { left, right, type Either } from "../../domain/shared/Either";
import ApplicationError from "../error/ApplicationError";
import type AccountLocalStorageInterface from "../localstorage/AccountLocalStorageInterface";

export default class Logout implements UseCase {

    constructor(
        private accountLocalStorage: AccountLocalStorageInterface
    ) { }

    async execute(input: LogoutInput): LogoutOutput {
        try {
            this.accountLocalStorage.remove();
            return right("done");
        } catch (error) {
            return left(new ApplicationError("Something went wrong trying logout, please try again"));
        }
    }
}

export type LogoutInput = any;

export type LogoutOutput = Promise<
    Either<
        ApplicationError,
        "done"
    >
>;
