import { injectable, inject } from "inversify";
import { IDataStorage, IDomainCrawlQueue, IDomainCrawl } from "../container/interfaces";
import { TYPES } from "../container/inversify-helpers/TYPES";
import { Domain } from "../entities";

var amqp = require('amqplib');
let logger = require('perfect-logger');

@injectable()
export class DomainCrawlQueue implements IDomainCrawlQueue {
    private readonly queueName = 'queue';
    private options = {
        protocol: 'amqp',
        hostname: 'rabbit.twopointzero.eu',
        port: 5672,
        username: 'andrewkorol',
        password: 'W#&nfR9$',
        vhost: 'scraper',
        heartbeat: 60,
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
                const messages = await this._dataStorage.getDomains();

                messages.forEach((domain: Domain) => {    
                    if(domain.id) {
                        return ch.sendToQueue(this.queueName, Buffer.from(JSON.stringify(domain)));
                    }              
                })
            });
        }).catch((ex) => {
            logger.crit("Exception oqqured while run /'produse/' in DomainCrawlQueue: ", ex);
        });
    }

    private consume(): void {
        this.connection.then(function (conn) {
            return conn.createChannel();
        }).then((ch) => {
            return ch.assertQueue(this.queueName).then((ok) => {
                ch.prefetch(30);

                return ch.consume(this.queueName, async (msg) => {
                    if (msg !== null) {
                        const messageContent = msg.content.toString();
                        const message: Domain = JSON.parse(messageContent);

                        if(message.id) {
                            await this._domainCrawl.crawl(message);
                        }

                        ch.ack(msg);
                    }
                });
            });
        }).catch((ex) => {
            logger.crit("Exception oqqured while run /'consume/' in DomainCrawlQueue: ", ex);
        });
    }
}
