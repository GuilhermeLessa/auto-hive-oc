import MonitoringApiInterface from "../../application/monitoring/MonitoringApiInterface";
import HttpClient from "../../application/http/HttpClient";

export default class MonitoringApi implements MonitoringApiInterface {

    constructor(
        private httpClient: HttpClient,
    ) { }

    startMonitor(
        token: string,
        accountId: number,
        farmId: number,
        workerId: number,
        workerDataId: string
    ): Promise<any> {
        return this.httpClient.post(
            `/farms/${farmId}/workers/${workerId}/start/${workerDataId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { token, accountId }
            }
        );
    }

}