import AxiosHttp from "../../src/infra/http/AxiosHttp";
import DashboardApi from "../../src/infra/dashboard/DashboardApi";
import HttpClient from "../../src/application/http/HttpClient";
import { test, expect, beforeAll } from 'vitest';

let dashboardApi;
const url = import.meta.env.VITE_DASHBOARD_API_URL;
const token = import.meta.env.VITE_TEST_TOKEN;
const accountId = import.meta.env.VITE_TEST_ACCOUNT_ID;
const farmId = import.meta.env.VITE_TEST_FARM_ID;
const workerId = import.meta.env.VITE_TEST_WORKER_ID;

beforeAll(() => {
    expect(url).toBeDefined();
    expect(token).toBeDefined();
    expect(accountId).toBeDefined();
    expect(farmId).toBeDefined();
    expect(workerId).toBeDefined();
    dashboardApi = new DashboardApi(new AxiosHttp(url) as HttpClient);
    dashboardApi.setAccountId(accountId);
    dashboardApi.setToken(token);
});

test("Test post account", async () => {
    let authOrError = await dashboardApi.postAccount(token);
    expect(authOrError.isRight()).toBeTruthy();
    authOrError = await dashboardApi.postAccount("");
    expect(authOrError.isLeft()).toBeTruthy();
});

test("Test get farms data", async () => {
    let farmsOrError = await dashboardApi.getFarms();
    expect(farmsOrError.isRight()).toBeTruthy();
    dashboardApi.setToken("");
    farmsOrError = await dashboardApi.getFarms();
    expect(farmsOrError.isLeft()).toBeTruthy();
    dashboardApi.setToken(token);
});

test("Test get workers data", async () => {
    let workersOrError = await dashboardApi.getWorkers(farmId);
    expect(workersOrError.isRight()).toBeTruthy();
    workersOrError = await dashboardApi.getWorkers(0);
    expect(workersOrError.isLeft()).toBeTruthy();
});

test("Test get worker", async () => {
    let workerOrError = await dashboardApi.getWorker(farmId, workerId);
    expect(workerOrError.isRight()).toBeTruthy();
    //expectTypeOf({ a: 1 }).toEqualTypeOf<{ a: string }>();
    workerOrError = await dashboardApi.getWorkers(0, 0);
    expect(workerOrError.isLeft()).toBeTruthy();
});

test.skip("Test post monitoring state", async () => {
    let saveOrError = await dashboardApi.postWorker(
        farmId,
        workerId,
        { monitoring: false }
    );
    expect(saveOrError.isRight()).toBeTruthy();
});

test.skip("Test post gpu settings", async () => {
    let saveOrError = await dashboardApi.postGpus(
        farmId,
        workerId,
        [
            {
                bus: 1,
                isMonitoringCore: false,
                maximumCoreTemperature: 0,
                initialCoreClock: 0,
                maximumCoreClock: 0,
                isMonitoringMemorie: false,
                maximumMemorieTemperature: 0,
                initialMemorieClock: 0,
                maximumMemorieClock: 0
            },
            {
                bus: 2,
                isMonitoringCore: false,
                maximumCoreTemperature: 0,
                initialCoreClock: 0,
                maximumCoreClock: 0,
                isMonitoringMemorie: false,
                maximumMemorieTemperature: 0,
                initialMemorieClock: 0,
                maximumMemorieClock: 0
            }
        ]
    );
    expect(saveOrError.isRight()).toBeTruthy();

    saveOrError = await dashboardApi.postGpus(
        farmId,
        workerId,
        [
            {
                bus: 1,
                isMonitoringCore: false,
                maximumCoreTemperature: 0,
                initialCoreClock: 499,
                maximumCoreClock: 500,
                isMonitoringMemorie: false,
                maximumMemorieTemperature: 0,
                initialMemorieClock: 0,
                maximumMemorieClock: 0
            },
            {
                bus: 2,
                isMonitoringCore: false,
                maximumCoreTemperature: 0,
                initialCoreClock: 0,
                maximumCoreClock: 0,
                isMonitoringMemorie: false,
                maximumMemorieTemperature: 0,
                initialMemorieClock: 0,
                maximumMemorieClock: 0
            }
        ]
    );
    expect(saveOrError.isLeft()).toBeTruthy();
});





