import axios from "axios";
import type HttpClient from "../../application/http/HttpClient";
import { HttpSuccesResponse, GenericHttpError, UnauthorizedHttpError } from "../../application/http/HttpClient";
import { Either, left, right } from "../../domain/shared/Either";

export default class AxiosHttp implements HttpClient {

    constructor(
        private baseUrl: string
    ) { }

    get(url: string, options?: any) {
        return this.request('get', url, options);
    }

    post(url: string, options?: any, body?: any) {
        return this.request('post', url, options, body);
    }

    private async request(method: string, url: string, options?: any, body?: any)
        : Promise<
            Either<
                GenericHttpError | UnauthorizedHttpError,
                HttpSuccesResponse
            >
        > {
        let headers: any = { "Content-Type": "application/json" };
        if (options?.headers) {
            headers = { ...headers, ...options.headers };
        }

        let response: any;
        try {
            response = await axios.request({
                baseURL: this.baseUrl,
                url,
                method,
                headers,
                params: options?.params,
                data: body,
                responseType: 'json',
            });
            return right({ data: response.data });

        } catch (error: any) {
            if (error?.response?.status == 401) {
                return left(new UnauthorizedHttpError());
            }
            return left(new GenericHttpError(error?.response?.status, error?.message));
        }
    }

}