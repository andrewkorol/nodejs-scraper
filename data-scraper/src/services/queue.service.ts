import { injectable } from "inversify";

var amqp = require('amqplib');

@injectable()
export class QueueService {
    private readonly queueName = 'queue';
    private options = {
        protocol: 'amqp',
        hostname: 'rabbit.twopointzero.eu',
        port: 5672,
        username: 'andrewkorol',
        password: 'W#&nfR9$',
        vhost: 'scraper',
    };

    private connection;

    constructor() {
        this.connection = amqp.connect(this.options);
    }

    public async produse(messages): Promise<void>  {
        const conn = await this.connection;
        const ch = await conn.createChannel();
        await ch.assertQueue(this.queueName);

        messages.forEach((link) => {
            const sitemapUrl = `${link.id}/sitemap.xml`
            return ch.sendToQueue(this.queueName, Buffer.from(sitemapUrl));
        })
    }

    public async consume(handler): Promise<void> {
        const conn = await this.connection;
        const ch = await conn.createChannel();

        return ch.assertQueue(this.queueName).then((ok) => {
            return ch.consume(this.queueName, async (msg) => {
                if (msg !== null) {
                    const messageContent = msg.content.toString();
                    handler(messageContent);

                    ch.ack(msg);
                }
            });
        });
    }
}
