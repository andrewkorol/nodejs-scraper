import { injectable, inject } from "inversify";
import { IDataStorage, IDomainCrawlQueue, IDomainCrawl, IHtmlGrabQueue } from "../container/interfaces";
import { TYPES } from "../container/inversify-helpers/TYPES";

var amqp = require('amqplib');
const axios = require('axios');

@injectable()
export class HtmlGrabQueue implements IHtmlGrabQueue {
    private readonly queueName = 'html-queue';
    private options = {
        protocol: 'amqp',
        hostname: 'rabbit.twopointzero.eu',
        port: 5672,
        username: 'andrewkorol',
        password: 'W#&nfR9$',
        vhost: 'scraper',
    };

    private connection;
    private _dataStorage: IDataStorage;
    private _domainCrawl: IDomainCrawl;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IDomainCrawl) domainCrawl: IDomainCrawl) {
        this._dataStorage = dataStorage;
        this._domainCrawl = domainCrawl;

        this.connection = amqp.connect(this.options);
    }

    public fire(): void {
        this.produse();
        this.consume();
    }

    private produse(): void {
        this.connection.then(function (conn) {
            return conn.createChannel();
        }).then((ch) => {
            return ch.assertQueue(this.queueName).then(async (ok) => {
                const messages = await this._dataStorage.getAllLinks();

                // console.log('messages count', messages.length)
                messages.forEach((link) => {
                    return ch.sendToQueue(this.queueName, Buffer.from(link.id));
                })
            });
        }).catch(console.warn);
    }

    private consume(): void {
        this.connection.then(function (conn) {
            return conn.createChannel();
        }).then((ch) => {
            return ch.assertQueue(this.queueName).then((ok) => {
                return ch.consume(this.queueName, async (msg) => {
                    if (msg !== null) {
                        const messageContent = msg.content.toString();
                        console.log(messageContent);

                        await this.collectHtml(messageContent);
                        ch.ack(msg);
                    }
                });
            });
        }).catch(console.warn);
    }

    private async collectHtml(link: string) {
        const res = await axios.get(link);
    
        this._dataStorage.updateDomainLink(link, res.data);
    }
}
