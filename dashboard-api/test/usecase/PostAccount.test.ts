import Database from "../../src/application/database/Database";
import HiveOsApiInterface from "../../src/application/hiveos/HiveOsApiInterface";
import { UnauthorizedHttpError } from "../../src/application/http/HttpClient";
import PostAccount from "../../src/application/usecase/PostAccount";
import AccountData from "../../src/domain/entity/data/AccountData";
import MongoDatabase from "../../src/infra/database/mongo/MongoDatabase";
import AccountMongoRepository from "../../src/infra/database/mongo/repository/Account/AccountMongoRepository";
import HiveOsApi from "../../src/infra/hiveos/HiveOsApi";
import AxiosHttp from "../../src/infra/http/AxiosHttp";

require('dotenv').config({ path: 'env/localhost.env' });

const hiveApiUrl = process.env.HIVE_OS_API_URL;
const mongoApp = process.env.MONGO_APP;
const mongoCluster = process.env.MONGO_CLUSTER;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const token = process.env.TEST_TOKEN;
const accountId = parseInt(process.env.TEST_ACCOUNT_ID!);

let postAccount: any;
let accountRepository: any;
beforeAll(async () => {
    expect(hiveApiUrl).toBeDefined();
    expect(mongoApp).toBeDefined();
    expect(mongoCluster).toBeDefined();
    expect(mongoDatabase).toBeDefined();
    expect(mongoUser).toBeDefined();
    expect(mongoPassword).toBeDefined();
    expect(token).toBeDefined();
    expect(accountId).toBeDefined();

    const hiveOsApi: HiveOsApiInterface = new HiveOsApi(new AxiosHttp(hiveApiUrl!));
    const database: Database = new MongoDatabase(mongoApp!, mongoCluster!, mongoDatabase!, mongoUser!, mongoPassword!);
    const databaseConnection = await database.connect();
    accountRepository = new AccountMongoRepository(databaseConnection);
    postAccount = new PostAccount(hiveOsApi, accountRepository);
});

test("Test posting a valid account that already exists", async () => {
    const accountRepositoryDataOrError = await accountRepository.findOne(token, accountId);
    expect(accountRepositoryDataOrError.isRight()).toBeTruthy();
    const accountRepositoryResult = accountRepositoryDataOrError.value;
    expect(accountRepositoryResult instanceof AccountData).toBeTruthy();

    const input = { token };
    const accountDataOrError = await postAccount.execute(input);
    expect(accountDataOrError.isRight()).toBeTruthy();
    const accountData = accountDataOrError.value;
    expect(accountData.accountId).toBe(accountId);
});

test.skip("Test posting a new valid account", async () => {
    const deleteOrError = await accountRepository.deleteMany(accountId);
    expect(deleteOrError.isRight()).toBeTruthy();
    const deleteResult = deleteOrError.value;
    const { deletedCount } = deleteResult;
    expect(deletedCount).toBeGreaterThan(0);

    const input = { token };
    const accountDataOrError = await postAccount.execute(input);
    expect(accountDataOrError.isRight()).toBeTruthy();
    const accountData = accountDataOrError.value;
    expect(accountData.accountId).toBe(accountId);
});

test("Test posting an invalid account", async () => {
    const input = { token: "" };
    const accountDataOrError = await postAccount.execute(input);
    expect(accountDataOrError.isLeft()).toBeTruthy();
    const error = accountDataOrError.value;
    expect(error instanceof UnauthorizedHttpError).toBeTruthy();
});