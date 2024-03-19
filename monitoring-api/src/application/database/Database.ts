export default interface Database {
    connect(): Promise<any>;
    getConnection(): any;
    closeConnection(): Promise<void>;
}