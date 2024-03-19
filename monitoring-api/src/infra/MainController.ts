import { param, query } from "express-validator";
import HttpServer, { HttpSendFunction } from "../application/http/HttpServer";
import CheckStatus from "../application/usecase/CheckStatus";
import MonitoringCheck from "../application/usecase/monitoring-check/MonitoringCheck";
import MonitoringStart from "../application/usecase/monitoring-start/MonitoringStart";
import Queue from "../application/queue/Queue";
import MonitoringCheckMessage from "../application/usecase/monitoring-check/MonitoringCheckMessage";
import MonitoringStartMessage from "../application/usecase/monitoring-start/MonitoringStartMessage";

export default class MainController {

    constructor(
        httpServer: HttpServer,
        queue: Queue,
        checkStatus: CheckStatus,
        monitoringStart: MonitoringStart,
        monitoringCheck: MonitoringCheck
    ) {

        httpServer.register(
            "get",
            "/status",
            () => [],
            (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                const output = checkStatus.execute();
                send(200, output.status);
            }
        );

        httpServer.register(
            "post",
            "/farms/:farmId/workers/:workerId/start/:monitoringId",
            () => [
                param(['farmId', 'workerId']).isInt({ min: 1 }).toInt(),
                param('monitoringId').isString().trim().notEmpty(),
                query("token").isString().trim().notEmpty(),
                query("accountId").isInt({ min: 1 }).toInt()
            ],
            (
                validation: any, query: any, params: any, body: any, send: HttpSendFunction
            ) => {
                if (!validation.isEmpty()) {
                    send(500);
                    return;
                }
                const { token, accountId } = query;
                const { farmId, workerId, monitoringId } = params;
                const message = new MonitoringStartMessage(token, accountId, farmId, workerId, monitoringId, queue);
                message.start();
                send(200);
            }
        );

        queue.consumeStart((
            token: string, accountId: number, farmId: number, workerId: number, monitoringId: string, ack: Function
        ) => {
            const message = new MonitoringStartMessage(token, accountId, farmId, workerId, monitoringId, queue, ack);
            const input = { message };
            monitoringStart.execute(input);
        });

        queue.consumeCheck((
            token: string, accountId: number, farmId: number, workerId: number, monitoringId: string, counter: number, ack: Function
        ) => {
            const message = new MonitoringCheckMessage(token, accountId, farmId, workerId, monitoringId, queue, ack, counter);
            const input = { message };
            monitoringCheck.execute(input);
        });

    }

}