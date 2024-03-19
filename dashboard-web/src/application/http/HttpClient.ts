import type { Either } from "@/domain/shared/Either";
import type ApplicationError from "../error/ApplicationError";

export default interface HttpClient {
    get(url: string, options?: any)
        : Promise<
            Either<
                GenericHttpError | UnauthorizedHttpError | ApplicationError,
                HttpSuccesResponse
            >
        >;

    post(url: string, options?: any, body?: any)
        : Promise<
            Either<
                GenericHttpError | UnauthorizedHttpError | ApplicationError,
                HttpSuccesResponse
            >
        >;
}

export interface HttpSuccesResponse { data: any };

export class UnauthorizedHttpError {

    readonly message: string = 'Unauthorized';
    readonly statusCode: number = 401;

}

export class GenericHttpError {

    readonly message: string;
    readonly statusCode: number;

    constructor(
        statusCode: number = 500,
        message: string = 'Internal Server Error',
    ) {
        this.message = message;
        this.statusCode = statusCode;
    }

}