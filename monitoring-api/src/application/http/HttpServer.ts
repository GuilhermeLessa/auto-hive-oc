export default interface HttpServer {

    enableCors(): void;

    enableJson(): void;

    register(method: string, url: string, validators: HttpValidatorsFunction, callback: HttpCallbackFunction): void;

    onError(handler: HttpErrorMiddlewareHandler): void;

    listen(port: number, callback: Function): void;

}

export type HttpValidatorsFunction = () => Array<any> | [];

export type HttpCallbackFunction = (
    validation: any,
    query: any,
    params: any,
    body: any,
    send: HttpSendFunction
) => void;

export type HttpSendFunction = (
    statusCode: number,
    content?: any,
) => void;

export type HttpErrorMiddlewareHandler = (
    error: any,
    send: HttpSendFunction
) => void;