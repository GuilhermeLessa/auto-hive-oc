import HttpServer, { HttpCallbackFunction, HttpErrorMiddlewareHandler, HttpSendFunction, HttpValidatorsFunction } from "../../application/http/HttpServer";
import express, { Express, Request, Response, json } from "express";
import cors from "cors";
import { validationResult } from "express-validator";
require("express-async-errors");

export default class ExpressServer implements HttpServer {

    private express: Express = express();

    enableCors(): void { 
        this.express.use(cors());
    }

    enableJson(): void {
        this.express.use(json());
    }

    register(
        method: "get" | "post" | "put" | "delete",
        url: string,
        validators: HttpValidatorsFunction,
        callback: HttpCallbackFunction,
    ): void {
        this.express[method](
            url,
            ...validators(),
            (req: Request, res: Response) => {
                const validation = validationResult(req);
                callback(validation, req.query, req.params, req.body, this.send(res));
            }
        );
    }

    onError(handler: HttpErrorMiddlewareHandler) {
        this.express.use((err: any, req: any, res: any, next: any) => {
            handler(err, this.send(res));
        });
    }

    private send(res: Response) {
        const send: HttpSendFunction = (statusCode: number, content: string) => {
            if (!content) {
                res.sendStatus(statusCode);
                return;
            }
            res.status(statusCode).send(content);
        };
        return send;
    }

    listen(port: number, callback: Function): void {
        this.express.listen(port, () => {
            callback();
        });
    }

}