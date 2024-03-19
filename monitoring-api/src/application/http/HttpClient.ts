import { Either } from "../../domain/shared/Either";

export default interface HttpClient {
    get(url: string, options?: any)
        : Promise<
            Either<
                GenericHttpError | UnauthorizedHttpError,
                HttpSuccesResponse
            >
        >;

    post(url: string, options?: any, body?: any)
        : Promise<
            Either<
                GenericHttpError | UnauthorizedHttpError,
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
        message: string = 'Internal Server Error',
        statusCode: number = 500,
    ) {
        this.message = message;
        this.statusCode = statusCode;
    }

}