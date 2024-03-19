import { Either, left, right } from "../../domain/shared/Either";
import { GenericHttpError, UnauthorizedHttpError } from "../../application/http/HttpClient";
import HttpClient from "../../application/http/HttpClient";
import HiveOsWorkerDataParser from "./HiveOsWorkerDataParser";
import HiveOsPostOverclocksData from "../../application/hiveos/HiveOsPostOverclocksData";
import HiveOsWorkerData from "../../application/hiveos/HiveOsWorkerData";
import HiveOsApiInterface from "../../application/hiveos/HiveOsApiInterface";
import ApplicationError from "../../application/error/ApplicationError";

export default class HiveOsApi implements HiveOsApiInterface {

    constructor(
        private httpClient: HttpClient
    ) { }

    async getWorker(token: string, farmId: number, workerId: number): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            HiveOsWorkerData
        >
    > {
        const responseOrError = await this.httpClient.get(
            `/farms/${farmId}/workers/${workerId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }

        const response = responseOrError.value;
        const parser = new HiveOsWorkerDataParser(response.data);
        const data = parser.getData();
        if (!data) {
            return left(new ApplicationError('Invalid worker data'));
        }
        return right(data);
    }

    async postOverclocks(token: string, farmId: number, workerId: number, data: HiveOsPostOverclocksData): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError,
            "done"
        >
    > {
        if (data.gpus.length) {
            return right("done");
        }

        const postData = {
            gpu_data: data.gpus.map(gpu => {
                let clocks: any = {};
                if (gpu.core) {
                    clocks.core_clock = gpu.core;
                }
                if (gpu.memorie) {
                    clocks.mem_clock = gpu.memorie;
                }
                return {
                    gpus: [
                        {
                            worker_id: workerId,
                            gpu_index: gpu.index,
                        }
                    ],
                    [gpu.brand]: clocks
                }
            })
        };

        const responseOrError = await this.httpClient.post(
            `/farms/${farmId}/workers/overclock`,
            { headers: { Authorization: `Bearer ${token}` } },
            postData
        );
        if (responseOrError.isLeft()) {
            const error = responseOrError.value;
            return left(error);
        }
        return right("done");
    }

}
