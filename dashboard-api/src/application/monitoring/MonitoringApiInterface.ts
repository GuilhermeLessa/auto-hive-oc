export default interface MonitoringApiInterface {

    startMonitor(
        token: string,
        accountId: number,
        farmId: number,
        workerId: number,
        workerDataId: string
    ): Promise<any>;

}