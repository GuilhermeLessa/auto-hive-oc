import type AccountLocalStorageInterface from "@/application/localstorage/AccountLocalStorageInterface";
import { LocalStorageDataNotFound, LocalStorageInvalidData } from "@/application/localstorage/LocalStorage";
import { left, type Either, right } from "@/domain/shared/Either";

export default class AccountLocalStorage implements AccountLocalStorageInterface {

    constructor(
        private localStorage: Storage
    ) { }

    add(accountId: number, token: string): void {
        this.localStorage.account = JSON.stringify({ accountId, token });
    }

    remove(): void {
        this.localStorage.removeItem("account");
    }

    get(): Either<
        LocalStorageDataNotFound | LocalStorageInvalidData,
        { accountId: number, token: string }
    > {
        if (!this.localStorage.account) {
            return left(new LocalStorageDataNotFound);
        }
        const { accountId, token } = JSON.parse(this.localStorage.account);
        return right({ accountId, token });
    }

}