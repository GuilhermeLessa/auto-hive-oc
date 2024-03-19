import Database from "./application/database/Database";
import AccountRepository from "./application/repository/AccountRepository";
import WorkerRepository from "./application/repository/WorkerRepository";
import GpuRepository from "./application/repository/GpuRepository";

import MongoDatabase from "./infra/database/mongo/MongoDatabase";
import AccountMongoRepository from "./infra/database/mongo/repository/Account/AccountMongoRepository";
import WorkerMongoRepository from "./infra/database/mongo/repository/Worker/WorkerMongoRepository";
import GpuMongoRepository from "./infra/database/mongo/repository/Gpu/GpuMongoRepository";

import HttpServer, { HttpSendFunction } from "./application/http/HttpServer";
import ExpressServer from "./infra/http/ExpressServer";

import HttpClient from "./application/http/HttpClient";
import AxiosHttp from "./infra/http/AxiosHttp";

import HiveOsApiInterface from "./application/hiveos/HiveOsApiInterface";
import HiveOsApi from "./infra/hiveos/HiveOsApi";

import MonitoringApiInterface from "./application/monitoring/MonitoringApiInterface";
import MonitoringApi from "./infra/monitoring/MonitoringApi";

import PostAccount from "./application/usecase/PostAccount";
import GetFarms from "./application/usecase/GetFarms";
import GetWorkers from "./application/usecase/GetWorkers";
import GetWorker from "./application/usecase/GetWorker";
import StartMonitoring from "./application/usecase/StartMonitoring";
import StopMonitoring from "./application/usecase/StopMonitoring";
import PostGpus from "./application/usecase/PostGpus";

import MainController from "./infra/MainController";
import GetHiveOsWorker from "./application/usecase/GetHiveOsWorker";

const httpServer: HttpServer = new ExpressServer();
const httpServerPort: number = parseInt(process.env.DASHBOARD_API_PORT!);
httpServer.enableCors();
httpServer.enableJson();

const database: Database = new MongoDatabase(
	process.env.MONGO_APP!,
	process.env.MONGO_CLUSTER!,
	process.env.MONGO_DATABASE!,
	process.env.MONGO_USER!,
	process.env.MONGO_PASSWORD!
);

const hiveOsApi: HiveOsApiInterface = new HiveOsApi(
	new AxiosHttp(process.env.HIVE_OS_API_URL!) as HttpClient
);

const monitoringApi: MonitoringApiInterface = new MonitoringApi(
	new AxiosHttp(process.env.MONITORING_API_URL!) as HttpClient
);

const start = (async () => {
	console.log("Dashboard API starting...");

	const databaseConnection = await database.connect();
	console.log("Database connected.");

	const accountRepository: AccountRepository = new AccountMongoRepository(databaseConnection);
	const workerRepository: WorkerRepository = new WorkerMongoRepository(databaseConnection);
	const gpuRepository: GpuRepository = new GpuMongoRepository(databaseConnection);
	console.log("Repositories loaded.");

	const getHiveOsWorker = new GetHiveOsWorker(hiveOsApi);
	const postAccunt = new PostAccount(hiveOsApi, accountRepository);
	const getFarms = new GetFarms(hiveOsApi);
	const getWorkers = new GetWorkers(hiveOsApi);
	const getWorker = new GetWorker(getHiveOsWorker, workerRepository, gpuRepository);
	const startMonitoring = new StartMonitoring(getHiveOsWorker, workerRepository, gpuRepository, monitoringApi);
	const stopMonitoring = new StopMonitoring(workerRepository);
	const postGpus = new PostGpus(getHiveOsWorker, gpuRepository);
	console.log("Usecases loaded.");

	new MainController(
		httpServer,
		postAccunt,
		getFarms,
		getWorkers,
		getWorker,
		startMonitoring,
		stopMonitoring,
		postGpus
	);
	console.log("MainController loaded.");

	httpServer.onError((error: any, send: HttpSendFunction) => {
		console.log('ERRO:', error);
		if (error.message) {
			console.log('ERRO_MESSAGE:', error.message);
		}
		const statusCode: number = 500;
		const message: string = 'Internal Server Error';
		send(statusCode, { message });
		return;
	});

	httpServer.listen(httpServerPort, () => {
		console.log(`Dashboard API listening on port ${httpServerPort}`);
	});
});
start();
