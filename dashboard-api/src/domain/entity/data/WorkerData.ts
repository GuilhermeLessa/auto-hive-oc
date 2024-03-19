export default class WorkerData {

    private constructor(
        readonly uuid: string,
        readonly accountId: number,
        readonly farmId: number,
        readonly workerId: number,
        readonly isMonitoring: boolean,
        readonly createdAt: Date,
    ) { }

    static create(
        accountId: number,
        farmId: number,
        workerId: number,
        isMonitoring: boolean,
    ) {
        return new WorkerData(
            crypto.randomUUID(),
            accountId,
            farmId,
            workerId,
            isMonitoring,
            new Date()
        );
    }

    static restore(
        uuid: string,
        accountId: number,
        farmId: number,
        workerId: number,
        isMonitoring: boolean,
        createdAt: Date,
    ) {
        return new WorkerData(
            uuid,
            accountId,
            farmId,
            workerId,
            isMonitoring,
            createdAt,
        );
    }

}