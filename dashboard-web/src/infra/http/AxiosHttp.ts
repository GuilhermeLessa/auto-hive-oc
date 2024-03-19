import axios from "axios";
import type HttpClient from "../../application/http/HttpClient";
import { GenericHttpError, UnauthorizedHttpError, type HttpSuccesResponse } from "../../application/http/HttpClient";
import { left, right, type Either } from "@/domain/shared/Either";
import ApplicationError from "@/application/error/ApplicationError";

export default class AxiosHttp implements HttpClient {

    constructor(
        private baseUrl: string
    ) { }

    get(url: string, options?: any): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            HttpSuccesResponse
        >
    > {
        return this.request('get', url, options);
    }

    post(url: string, options?: any, body?: any): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
            HttpSuccesResponse
        >
    > {
        return this.request('post', url, options, body);
    }

    private async request(method: string, url: string, options?: any, body?: any): Promise<
        Either<
            GenericHttpError | UnauthorizedHttpError | ApplicationError,
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
            const _error = error?.response?.data?.error;
            if (_error) { //unique string
                return left(new ApplicationError(_error));
            }
            const errors = error?.response?.data?.errors;
            if (errors) { //array of strings
                return left(new ApplicationError(errors));
            }
            if (error?.response?.status) {
                return left(new GenericHttpError(error?.response?.status));
            }
            return left(new GenericHttpError());
        }
    }

}