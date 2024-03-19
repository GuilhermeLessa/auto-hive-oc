import AccountLocalStorage from "../../src/infra/localstorage/AccountLocalStorage";
import { LocalStorageDataNotFound } from "../../src/application/localstorage/LocalStorage";
import { test, expect } from 'vitest';

test("Test account local storage", async () => {
    const accountStorage = new AccountLocalStorage(localStorage);

    let accountOrError = accountStorage.get();
    expect(
        accountOrError.isLeft() &&
        accountOrError.value instanceof LocalStorageDataNotFound
    ).toBeTruthy();

    accountStorage.add(1, "token");
    accountOrError = accountStorage.get();
    expect(accountOrError.isRight()).toBeTruthy();

    const { accountId, token } = accountOrError.value;
    expect(accountId).toBe(1);
    expect(token).toBe("token");

    accountStorage.remove();
    accountOrError = accountStorage.get();
    expect(
        accountOrError.isLeft() &&
        accountOrError.value instanceof LocalStorageDataNotFound
    ).toBeTruthy();
});
