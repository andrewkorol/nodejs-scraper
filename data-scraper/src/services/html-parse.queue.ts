import { injectable, inject } from "inversify";
import { IDataStorage, IHtmlGrabQueue, IParser } from "../container/interfaces";
import { TYPES } from "../container/inversify-helpers/TYPES";
import { IHtmlParseQueue } from "../container/interfaces/html-parser-queue.interface";
import { Link } from "../entities";


let logger = require('perfect-logger');
var amqp = require('amqplib');
const axios = require('axios');

@injectable()
export class HtmlParseQueue implements IHtmlParseQueue {
    private readonly queueName = 'parse-queue';
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
    private _parser: IParser;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IParser) parser: IParser) {
        this._dataStorage = dataStorage;
        this._parser = parser;

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

                messages.forEach((link) => {
                    if(link.html && link.id) {
                        return ch.sendToQueue(this.queueName, Buffer.from(JSON.stringify(link)));
                    }
                })
            });
        }).catch((ex) => {
            logger.crit("Exception oqqured while run /'produse/' in HtmlParseQueue: ", ex);
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
                        const link: Link = JSON.parse(messageContent);
                
                        if(link.html && link.id) {
                            await this._parser.parse(link);
                        }

                        ch.ack(msg);
                    }
                });
            });
        }).catch((ex) => {
            logger.crit("Exception oqqured while run /'consume/' in HtmlParseQueue: ", ex);
        });
    }
}
