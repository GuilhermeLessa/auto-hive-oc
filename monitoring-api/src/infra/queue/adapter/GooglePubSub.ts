import { Message, PubSub } from "@google-cloud/pubsub";
import QueueAdapter, { consumeHandlerFunction } from "../../../application/queue/QueueAdapter";

export default class GooglePubSub implements QueueAdapter {

    private pubsub!: PubSub;
    private projectId: string;

    constructor(projectId: string) {
        this.projectId = projectId;
    }

    connect(): Promise<void> {
        return new Promise(resolve => {
            this.pubsub = new PubSub({
                projectId: this.projectId
            });
            resolve();
        });
    }

    send(topic: string, message: object): void {
        const jsonMessage = JSON.stringify(message);
        this.pubsub.topic(topic).publishMessage({
            data: Buffer.from(jsonMessage)
        });
    }

    consume(subscription: string, callback: consumeHandlerFunction): void {
        this.pubsub
            .subscription(subscription)
            .on('message', message => {
                if (!message || !message.data || !message.data.toString()) {
                    callback(null, this.ack(message));
                    return;
                }
                const parsedMessage = JSON.parse(message.data.toString());
                callback(parsedMessage, this.ack(message));
            });
    }

    private ack(message: Message): Function {
        return () => {
            message.ack();
        };
    }

}