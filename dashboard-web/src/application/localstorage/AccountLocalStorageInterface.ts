import type { Either } from "@/domain/shared/Either";
import type { LocalStorageDataNotFound, LocalStorageInvalidData } from "./LocalStorage";

export default interface AccountLocalStorageInterface {
    add(accountId: number, token: string): void;
    remove(): void;
    get(): Either<
        LocalStorageDataNotFound | LocalStorageInvalidData,
        { accountId: number, token: string }
    >;
}

