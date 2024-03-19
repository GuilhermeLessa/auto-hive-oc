import ApplicationError from "../../src/application/error/ApplicationError";
import StartMonitoring from "../../src/application/usecase/StartMonitoring";
import { left, right } from "../../src/domain/shared/Either";

test("Test starting monitoring when hiveos worker is offline", async () => {
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(right({
            isOnline: () => false
        })),
    }
    const workerRepository: any = {};
    const gpuRepository: any = {};
    const monitoringApi: any = {};
    const startMonitoring = new StartMonitoring(getHiveOsWorker, workerRepository, gpuRepository, monitoringApi);

    const input = { token: "", accountId: 0, farmId: 0, workerId: 0, monitoring: true };
    const output = await startMonitoring.execute(input);
    expect(output.isLeft()).toBeTruthy();
    const error = output.value;
    expect(error instanceof ApplicationError).toBeTruthy();
    if (!(error instanceof ApplicationError)) return;
    expect(error.publicMessage).toBe("Worker offline");
});

test("Test starting monitoring when monitoring provided is false", async () => {
    const getHiveOsWorker: any = {};
    const workerRepository: any = {};
    const gpuRepository: any = {};
    const monitoringApi: any = {};
    const startMonitoring = new StartMonitoring(getHiveOsWorker, workerRepository, gpuRepository, monitoringApi);

    const input = { token: "", accountId: 0, farmId: 0, workerId: 0, monitoring: false };
    const output = await startMonitoring.execute(input);
    expect(output.isLeft()).toBeTruthy();
    const error = output.value;
    expect(error instanceof ApplicationError).toBeTruthy();
    if (!(error instanceof ApplicationError)) return;
    expect(error.privateMessage).toBe("Start monitoring requires a true signal");
});

test("Test starting monitoring when error getting hiveos worker", async () => {
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(left(new ApplicationError("Error requesting hiveos"))),
    };
    const workerRepository: any = {};
    const gpuRepository: any = {};
    const monitoringApi: any = {};
    const startMonitoring = new StartMonitoring(getHiveOsWorker, workerRepository, gpuRepository, monitoringApi);

    const input = { token: "", accountId: 0, farmId: 0, workerId: 0, monitoring: true };
    const output = await startMonitoring.execute(input);
    expect(output.isLeft()).toBeTruthy();
    const error = output.value;
    expect(error instanceof ApplicationError).toBeTruthy();
    if (!(error instanceof ApplicationError)) return;
    expect(error.privateMessage).toBe("Error requesting hiveos");
});

test("Test starting monitoring when theres no gpu configured to monitoring", async () => {
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(right({
            isOnline: () => true
        })),
    }
    const workerRepository: any = {};
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({ success: [] })),
    }
    const monitoringApi: any = {};
    const startMonitoring = new StartMonitoring(getHiveOsWorker, workerRepository, gpuRepository, monitoringApi);

    const input = { token: "", accountId: 0, farmId: 0, workerId: 0, monitoring: true };
    const output = await startMonitoring.execute(input);
    expect(output.isLeft()).toBeTruthy();
    const error = output.value;
    expect(error instanceof ApplicationError).toBeTruthy();
    if (!(error instanceof ApplicationError)) return;
    expect(error.publicMessage).toBe("No valid GPU data set as monitoring ON");
});

test("Test starting monitoring when new worker data is not inserted", async () => {
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(right({
            isOnline: () => true
        })),
    }
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ isMonitoring: false })),
        deleteMany: () => Promise.resolve(right({ deletedCount: 1 })),
        insertOne: () => Promise.resolve(right(null)),
    };
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({ success: [{}, {}, {}] })),
    }
    const monitoringApi: any = {
        startMonitor: () => Promise.resolve(),
    };
    const startMonitoring = new StartMonitoring(getHiveOsWorker, workerRepository, gpuRepository, monitoringApi);

    const input = { token: "", accountId: 0, farmId: 0, workerId: 0, monitoring: true };
    const output = await startMonitoring.execute(input);
    expect(output.isLeft()).toBeTruthy();
    const error = output.value;
    expect(error instanceof ApplicationError).toBeTruthy();
    if (!(error instanceof ApplicationError)) return;
    expect(error.privateMessage).toBe("Error trying insert monitoring state");
});