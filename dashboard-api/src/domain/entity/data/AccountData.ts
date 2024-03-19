export default class AccountData {

    private constructor(
        readonly uuid: string,
        readonly token: string,
        readonly accountId: number,
        readonly createdAt: Date,
    ) { }

    static create(
        token: string,
        accountId: number,
    ) {
        return new AccountData(
            crypto.randomUUID(),
            token,
            accountId,
            new Date()
        );
    }

    static restore(
        uuid: string,
        token: string,
        accountId: number,
        createdAt: Date,
    ) {
        return new AccountData(
            uuid,
            token,
            accountId,
            createdAt,
        );
    }

}