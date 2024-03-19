import { Connection, Model, Schema } from "mongoose";

export default abstract class AbstractMongoModel {

    readonly model: Model<any>;

    constructor(
        connection: Connection, name: string, schema: Schema
    ) {
        this.model = connection.model(name, schema);
    }

    createModel(data: any) {
        return new this.model(data);
    }

}