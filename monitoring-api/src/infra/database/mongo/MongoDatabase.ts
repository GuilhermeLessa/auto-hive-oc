import mongoose, { Connection } from "mongoose";

import Database from "../../../application/database/Database";

export default class MongoDatabase implements Database {

    private uri: string;
    private connection: any;

    constructor(
        private appName: string,
        private clusterId: string,
        private databaseName: string,
        private user: string,
        private password: string,
    ) {
        this.uri = `mongodb+srv://${this.user}:${this.password}@${this.databaseName}.${this.clusterId}.mongodb.net/?retryWrites=true&w=majority&appName=${this.appName}`;
    }

    connect(): Promise<Connection> {
        return new Promise((resolve, reject) => {
            this.connection = mongoose.createConnection(this.uri);
            this.connection.on('connected', () => {
                resolve(this.connection);
            });
            this.connection.on('error', () => { reject() });
        })
    }

    getConnection(): Connection {
        return this.connection;
    }

    async closeConnection(): Promise<void> {
        await this.connection.close();
        return Promise.resolve();
    }

}
