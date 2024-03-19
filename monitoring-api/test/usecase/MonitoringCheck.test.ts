import ApplicationError from "../../src/application/error/ApplicationError";
import { GenericHttpError } from "../../src/application/http/HttpClient";
import GenericRepositoryError from "../../src/application/repository/GenericRepositoryError";
import MonitoringCheck from "../../src/application/usecase/monitoring-check/MonitoringCheck";
import MonitoringCheckMessage from "../../src/application/usecase/monitoring-check/MonitoringCheckMessage";
import MonitoringCheckWorker from "../../src/domain/entity/core/worker/MonitoringCheckWorker";
import { left, right } from "../../src/domain/shared/Either";
import sleep from "../sleep";

beforeAll(() => {
    //MOCK
    Object.defineProperty(MonitoringCheckMessage.prototype, 'MIN_MS', {
        get: jest.fn(() => 1),
        set: jest.fn()
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

test("Test monitoring retry when worker repository error", async () => {
    // FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(left(new GenericRepositoryError("")))
    };
    const ack = jest.fn();
    const gpuRepository: any = {};
    const getHiveOsWorker: any = {};
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring stop when worker repository not found", async () => {
    // FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right(null))
    };
    const ack = jest.fn();
    const gpuRepository: any = {};
    const getHiveOsWorker: any = {};
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).toHaveBeenCalled();
    expect(spyRetry).not.toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).not.toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring stop when worker repository has changed", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "b" })) //monitoringId = "a"
    };
    const ack = jest.fn();
    const gpuRepository: any = {};
    const getHiveOsWorker: any = {};
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).toHaveBeenCalled();
    expect(spyRetry).not.toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).not.toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring stop when worker repository monitoring state is false", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: false }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {};
    const getHiveOsWorker: any = {};
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).toHaveBeenCalled();
    expect(spyRetry).not.toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).not.toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring retry when gpu repository monitoring state error", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: true }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(left(new GenericRepositoryError("")))
    };
    const getHiveOsWorker: any = {};
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring retry when gpu repository monitoring state is not found", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: true }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({ success: [] }))
    };
    const getHiveOsWorker: any = {};
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring retry when get hive os worker error", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: true }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({ success: [{}, {}, {}] }))
    };
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(left(new ApplicationError("")))
    };
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring retry when get hive os worker is not mining", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: true }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({ success: [{}, {}, {}] }))
    };
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(right({
            isMining: () => false
        }))
    };
    const hiveOsApi: any = {};

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring retry when overclock post failed", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: true }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({
            success: [{ bus: 1 }]
        }))
    };
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(right({
            isMining: () => true,
            data: { worker_id: 1, gpus: [] },
        }))
    };
    const hiveOsApi: any = {
        postOverclocks: () => Promise.resolve(left(new GenericHttpError("")))
    };

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    //MOCK
    const spyTuneOverclock = jest.spyOn(MonitoringCheckWorker.prototype, "tunneOverclock");
    spyTuneOverclock.mockImplementation(() => { });

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).toHaveBeenCalled();
    expect(spyNext).not.toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledTimes(1);
});

test("Test monitoring next when overclock post success", async () => {
    //FAKE
    const queue: any = {
        check: () => { }
    };
    const workerRepository: any = {
        findOne: () => Promise.resolve(right({ uuid: "a", isMonitoring: true }))
    };
    const ack = jest.fn();
    const gpuRepository: any = {
        findOnlyMonitoringTrue: () => Promise.resolve(right({
            success: [{ bus: 1 }]
        }))
    };
    const getHiveOsWorker: any = {
        execute: () => Promise.resolve(right({
            isMining: () => true,
            data: { worker_id: 1, gpus: [] },
        }))
    };
    const hiveOsApi: any = {
        postOverclocks: () => Promise.resolve(right("done"))
    };

    //SPY
    const spyStop = jest.spyOn(MonitoringCheckMessage.prototype, "stop");
    const spyRetry = jest.spyOn(MonitoringCheckMessage.prototype, "retry");
    const spyNext = jest.spyOn(MonitoringCheckMessage.prototype, "next");
    const spyCheck = jest.spyOn(queue, "check");

    //MOCK
    const spyTuneOverclock = jest.spyOn(MonitoringCheckWorker.prototype, "tunneOverclock");
    spyTuneOverclock.mockImplementation(() => { });
    const spyGetHasTemperatureEmergency = jest.spyOn(MonitoringCheckWorker.prototype, "getHasTemperatureEmergency");
    spyGetHasTemperatureEmergency.mockImplementation(() => false);

    const token = "", accountId = 1, farmId = 1, workerId = 1, monitoringId = "a", counter = 1;
    const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
    const input = { message };

    const usecase = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
    await usecase.execute(input);

    await sleep(300); //await retry timeout on MonitoringCheckMessage

    expect(spyStop).not.toHaveBeenCalled();
    expect(spyRetry).not.toHaveBeenCalled();
    expect(spyNext).toHaveBeenCalled();
    expect(spyCheck).toHaveBeenCalledWith(token, accountId, farmId, workerId, monitoringId, 2);
    expect(ack).toHaveBeenCalledTimes(1);
});