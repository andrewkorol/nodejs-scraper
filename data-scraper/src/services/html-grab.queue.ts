import { injectable, inject } from "inversify";
import { IDataStorage, IDomainCrawlQueue, IDomainCrawl, IHtmlGrabQueue, IDomainManagerService } from "../container/interfaces";
import { QueueConnectionsOptions } from '../helpers/queue-connection.settings'
import { TYPES } from "../container/inversify-helpers/TYPES";

var amqp = require('amqplib');
const axios = require('axios');
let logger = require('perfect-logger');
var request = require("request");

// Queue that collects html fron all links in 'Link' table and insertn it per each domain
@injectable()
export class HtmlGrabQueue implements IHtmlGrabQueue {
    private readonly queueName = 'html-queue';
    private options = QueueConnectionsOptions

    private connection;
    private _dataStorage: IDataStorage;
    private _domainCrawl: IDomainCrawl;
    private _domainManagerService: IDomainManagerService;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IDomainManagerService) domainManagerService: IDomainManagerService,
        @inject(TYPES.IDomainCrawl) domainCrawl: IDomainCrawl) {
        this._dataStorage = dataStorage;
        this._domainCrawl = domainCrawl;
        this._domainManagerService = domainManagerService;

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
            return ch.assertQueue(this.queueName, {
                durable: true
            }).then(async (ok) => {
                let messages;
                const links = await this._domainManagerService.getUniqueDomainLinks();

                messages = links ? links : await this._dataStorage.getAllLinks();

                messages.forEach((link) => {
                    return ch.sendToQueue(this.queueName, Buffer.from(link.id), {
                        persistent: true
                    });
                })
            }).then(() => ch.close());
        }).catch((ex) => {
            logger.crit("Exception oqqured while run 'produse' in HtmlGrabQueue: ", ex);
            console.log(ex)
        });
    }

    private consume(): void {
        this.connection.then(function (conn) {
            return conn.createChannel();
        }).then((ch) => {
            return ch.assertQueue(this.queueName, {
                durable: true
            }).then((ok) => {
                ch.prefetch(30);

                return ch.consume(this.queueName, async (msg) => {
                    if (msg !== null) {
                        const messageContent = msg.content.toString();
                        console.log(messageContent);

                        try {
                            await this.collectHtml(messageContent);

                        } catch (ex) {
                            console.log(ex)
                        }

                        ch.ack(msg);
                    }
                });
            });
        }).catch((ex) => {
            logger.crit("Exception oqqured while run /'consume/' in HtmlGrabQueue: ", ex);
        });
    }

    public async collectHtml(link: string) {
        const res = await axios.get(link);

        await this._dataStorage.updateDomainLink(link, JSON.stringify(res.data));
    }
}
