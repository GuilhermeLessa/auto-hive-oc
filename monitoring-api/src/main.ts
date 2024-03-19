import { ENV } from "./domain/shared/ENV";

import Database from "./application/database/Database";
import WorkerRepository from "./application/repository/WorkerRepository";
import GpuRepository from "./application/repository/GpuRepository";

import MongoDatabase from "./infra/database/mongo/MongoDatabase";
import WorkerMongoRepository from "./infra/database/mongo/repository/Worker/WorkerMongoRepository";
import GpuMongoRepository from "./infra/database/mongo/repository/Gpu/GpuMongoRepository";

import HttpServer, { HttpSendFunction } from "./application/http/HttpServer";
import ExpressServer from "./infra/http/ExpressServer";

import HttpClient from "./application/http/HttpClient";
import AxiosHttp from "./infra/http/AxiosHttp";

import HiveOsApiInterface from "./application/hiveos/HiveOsApiInterface";
import HiveOsApi from "./infra/hiveos/HiveOsApi";

import CheckStatus from "./application/usecase/CheckStatus";
import MonitoringCheck from "./application/usecase/monitoring-check/MonitoringCheck";
import MonitoringStart from "./application/usecase/monitoring-start/MonitoringStart";

import QueueProvider from "./infra/queue/QueueProvider";
import MainController from "./infra/MainController";
import GetHiveOsWorker from "./application/usecase/GetHiveOsWorker";

const httpServer: HttpServer = new ExpressServer();
const httpServerPort: number = parseInt(process.env.MONITORING_API_PORT!);
httpServer.enableCors();
httpServer.enableJson();

const database: Database = new MongoDatabase(
	process.env.MONGO_APP!,
	process.env.MONGO_CLUSTER!,
	process.env.MONGO_DATABASE!,
	process.env.MONGO_USER!,
	process.env.MONGO_PASSWORD!
);

const queue = (new QueueProvider(process.env.ENV as ENV)).provide();

const hiveOsApi: HiveOsApiInterface = new HiveOsApi(
	new AxiosHttp(process.env.HIVE_OS_API_URL!) as HttpClient
);

const start = (async () => {
	console.log("Monitoring API starting...");

	const databaseConnection = await database.connect();
	await queue.connect();
	console.log("Database and Queue connected.");

	const workerRepository: WorkerRepository = new WorkerMongoRepository(databaseConnection);
	const gpuRepository: GpuRepository = new GpuMongoRepository(databaseConnection);
	console.log("Repositories loaded.");

	const checkStatus = new CheckStatus();
	const getHiveOsWorker = new GetHiveOsWorker(hiveOsApi);
	const monitoringStart = new MonitoringStart(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
	const monitoringCheck = new MonitoringCheck(workerRepository, gpuRepository, getHiveOsWorker, hiveOsApi);
	console.log("Usecases loaded.");

	new MainController(
		httpServer,
		queue,
		checkStatus,
		monitoringStart,
		monitoringCheck
	);
	console.log("MainController loaded.");

	httpServer.onError((error: any, send: HttpSendFunction) => {
		console.log('ERRORR:', error);
		if (error.message) {
			console.log('ERROR_MESSAGER:', error.message);
		}
		const statusCode: number = 500;
		const message: string = 'Internal Server Error';
		send(statusCode, { message });
		return;
	});

	httpServer.listen(httpServerPort, () => {
		console.log(`Monitoring API listening on port ${httpServerPort}`);
	});
});
start();