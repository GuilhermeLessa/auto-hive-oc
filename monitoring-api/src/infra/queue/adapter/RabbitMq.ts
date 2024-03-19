import { connect, Channel, Connection, ConsumeMessage } from "amqplib";
import QueueAdapter, { consumeHandlerFunction } from "../../../application/queue/QueueAdapter";

export default class RabbitMq implements QueueAdapter {

    private uri: string;
    private connection!: Connection;
    private channel!: Channel;
    static readonly DELIVERY_MODE_PERSISTENT = 2;

    constructor(user: string, password: string, host: string, port: string) {
        this.uri = `amqp://${user}:${password}@${host}:${port}`;
    }

    connect(): Promise<void> {
        return new Promise(async resolve => {
            this.connection = await connect(this.uri);
            this.channel = await this.connection.createChannel();
            resolve();
        });
    }

    assert(queue: string, durable: boolean): Promise<void> {
        return new Promise(async resolve => {
            await this.channel.assertQueue(queue, { durable });
            resolve();
        });
    }

    send(queue: string, message: object): void {
        const jsonMessage = JSON.stringify(message);
        this.channel.sendToQueue(
            queue,
            Buffer.from(jsonMessage),
            { deliveryMode: RabbitMq.DELIVERY_MODE_PERSISTENT }
        );
    }

    consume(queue: string, callback: consumeHandlerFunction): void {
        this.channel.consume(queue, message => {
            if (!message || !message.content || !message.content.toString()) {
                callback(null, this.ack(message));
                return;
            }
            const parsedMessage = JSON.parse(message.content.toString());
            callback(parsedMessage, this.ack(message));
        });
    }

    private ack(message: ConsumeMessage | null): Function {
        if (!message) {
            return () => { };
        }
        return () => {
            this.channel.ack(message);
        };
    }

}