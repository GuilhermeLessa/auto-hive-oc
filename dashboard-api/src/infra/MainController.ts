import { body, param, query } from "express-validator";
import HttpServer, { HttpSendFunction } from "../application/http/HttpServer";
import { GenericHttpError, UnauthorizedHttpError } from "../application/http/HttpClient";
import ApplicationError from "../application/error/ApplicationError";
import GpuData from "../domain/entity/data/GpuData";
import PostAccount from "../application/usecase/PostAccount";
import GetFarms from "../application/usecase/GetFarms";
import GetWorkers from "../application/usecase/GetWorkers";
import GetWorker from "../application/usecase/GetWorker";
import StartMonitoring from "../application/usecase/StartMonitoring";
import StopMonitoring from "../application/usecase/StopMonitoring";
import PostGpus from "../application/usecase/PostGpus";
import GenericRepositoryError from "../application/repository/GenericRepositoryError";

export default class MainController {

    constructor(
        httpServer: HttpServer,
        postAccount: PostAccount,
        getFarms: GetFarms,
        getWorkers: GetWorkers,
        getWorker: GetWorker,
        startMonitoring: StartMonitoring,
        stopMonitoring: StopMonitoring,
        postGpus: PostGpus
    ) {

        httpServer.register(
            "post",
            "/account",
            () => [
                body('token').isString().trim().notEmpty(),
            ],
            async (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    send(401);
                    return;
                }
                const { token } = body;

                const input = { token };
                const accountDataOrError = await postAccount.execute(input);

                if (accountDataOrError.isRight()) {
                    const accountData = accountDataOrError.value;
                    send(200, { accountId: accountData.accountId });
                    return;
                }
                const error = accountDataOrError.value;
                if (error instanceof UnauthorizedHttpError) {
                    send(401);
                    return;
                }
                send(500);
            }
        );

        httpServer.register(
            "get",
            "/farms",
            () => [
                query('token').isString().trim().notEmpty(),
            ],
            async (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    send(500);
                    return;
                }
                const { token } = query;

                const input = { token };
                const farmsDataOrError = await getFarms.execute(input);

                if (farmsDataOrError.isRight()) {
                    const farmsData = farmsDataOrError.value;
                    send(200, farmsData);
                    return;
                }
                const error = farmsDataOrError.value;
                if (error instanceof UnauthorizedHttpError) {
                    send(401);
                    return;
                }
                send(500);
            }
        );

        httpServer.register(
            "get",
            "/farms/:farmId/workers",
            () => [
                param('farmId').isInt({ min: 1 }).toInt(),
                query('token').isString().trim().notEmpty(),
            ],
            async (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    send(500);
                    return;
                }
                const { token } = query;
                const { farmId } = params;

                const input = { token, farmId };
                const workersDataOrError = await getWorkers.execute(input);

                if (workersDataOrError.isRight()) {
                    const workersData = workersDataOrError.value;
                    send(200, workersData);
                    return;
                }
                const error = workersDataOrError.value;
                if (error instanceof UnauthorizedHttpError) {
                    send(401);
                    return;
                }
                send(500);
            }
        );

        httpServer.register(
            "get",
            "/farms/:farmId/workers/:workerId",
            () => [
                param(['farmId', 'workerId',]).isInt({ min: 1 }).toInt(),
                query("token").isString().trim().notEmpty(),
                query("accountId").isInt({ min: 1 }).toInt()
            ],
            async (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    send(500);
                    return;
                }
                const { farmId, workerId } = params;
                const { token, accountId } = query;

                const input = { token, accountId, farmId, workerId };
                const workerDataOrError = await getWorker.execute(input);

                if (workerDataOrError.isRight()) {
                    const workerData = workerDataOrError.value;
                    send(200, workerData);
                    return;
                }
                const error = workerDataOrError.value;
                if (error instanceof UnauthorizedHttpError) {
                    send(401);
                    return;
                }
                send(500);
            }
        );

        httpServer.register(
            "post",
            "/farms/:farmId/workers/:workerId",
            () => [
                param(['farmId', 'workerId',]).isInt({ min: 1 }).toInt(),
                query("token").isString().trim().notEmpty(),
                query("accountId").isInt({ min: 1 }).toInt(),
                body('monitoring').isBoolean()
            ],
            async (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    send(500);
                    return;
                }
                const { token, accountId } = query;
                const { farmId, workerId } = params;
                const { monitoring } = body;

                if (monitoring) {
                    const input = { token, accountId, farmId, workerId, monitoring };
                    const output = await startMonitoring.execute(input);
                    if (output.isRight()) {
                        send(200);
                        return;
                    }
                    const error = output.value;
                    if (error instanceof ApplicationError) {
                        if (error.publicMessage) {
                            send(500, { error: error.publicMessage });
                            return;
                        }
                        send(500);
                        return;
                    }
                    if (error instanceof UnauthorizedHttpError) {
                        send(401);
                        return;
                    }
                    send(500);
                    return;

                } else {
                    const input = { accountId, farmId, workerId, monitoring };
                    const output = await stopMonitoring.execute(input);
                    if (output.isRight()) {
                        send(200);
                        return;
                    }
                    send(500);
                    return;
                }
            }
        );

        httpServer.register(
            "post",
            "/farms/:farmId/workers/:workerId/gpus",
            () => [
                param(['farmId', 'workerId',]).isInt({ min: 1 }).toInt(),
                query("token").isString().trim().notEmpty(),
                query("accountId").isInt({ min: 1 }).toInt(),
                body('gpus').isArray({ min: 1 }),
                body('gpus.*.bus').isInt({ min: 0 }).toInt(),
                body('gpus.*.isMonitoringCore').isBoolean(),
                body('gpus.*.maximumCoreTemperature').isInt({ min: 0 }).toInt(),
                body('gpus.*.initialCoreClock').isInt({ min: 0 }).toInt(),
                body('gpus.*.maximumCoreClock').isInt({ min: 0 }).toInt(),
                body('gpus.*.isMonitoringMemorie').isBoolean(),
                body('gpus.*.maximumMemorieTemperature').isInt({ min: 0 }).toInt(),
                body('gpus.*.initialMemorieClock').isInt({ min: 0 }).toInt(),
                body('gpus.*.maximumMemorieClock').isInt({ min: 0 }).toInt(),
            ],
            async (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    console.log(validation);
                    send(500);
                    return;
                }
                const { token, accountId } = query;
                const { farmId, workerId } = params;
                let { gpus } = body;
                gpus = gpus.map((gpu: any) => ({
                    bus: gpu.bus,
                    isMonitoringCore: gpu.isMonitoringCore,
                    maximumCoreTemperature: gpu.maximumCoreTemperature,
                    initialCoreClock: gpu.initialCoreClock,
                    maximumCoreClock: gpu.maximumCoreClock,
                    isMonitoringMemorie: gpu.isMonitoringMemorie,
                    maximumMemorieTemperature: gpu.maximumMemorieTemperature,
                    initialMemorieClock: gpu.initialMemorieClock,
                    maximumMemorieClock: gpu.maximumMemorieClock,
                }));

                const input = { token, accountId, farmId, workerId, gpus };
                const output = await postGpus.execute(input);

                if (output.isRight()) {
                    send(200);
                    return;
                }
                const error = output.value;
                if (error instanceof ApplicationError) {
                    if (error.publicMessage) {
                        send(500, { error: error.publicMessage });
                        return;
                    }
                    send(500);
                    return;
                }
                if (error instanceof UnauthorizedHttpError) {
                    send(401);
                    return;
                }
                if (
                    error instanceof GenericHttpError ||
                    error instanceof GenericRepositoryError
                ) {
                    send(500);
                    return;
                }
                if (GpuData.containErrors(error)) {
                    const gpuDataErrors = error.flat();
                    const errors = gpuDataErrors.map(e => `GPU BUS ${e.bus}: ${e.message}`);
                    send(500, { errors });
                    return;
                }
                send(500);
                return;
            }
        );
    }

}