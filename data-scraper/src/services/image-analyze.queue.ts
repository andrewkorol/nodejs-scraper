import { injectable, inject } from "inversify";
import { IDataStorage, IHtmlGrabQueue, IParser, IGoogleVision } from "../container/interfaces";
import { TYPES } from "../container/inversify-helpers/TYPES";
import { IHtmlParseQueue } from "../container/interfaces/html-parser-queue.interface";
import { QueueConnectionsOptions } from '../helpers/queue-connection.settings'
import { Link, Image } from "../entities";
import { IImageAnalyzeQueue } from "../container/interfaces";


let logger = require('perfect-logger');
var amqp = require('amqplib');
const axios = require('axios');

//Queue thar receieves html from db and collects product information from it
@injectable()
export class ImageAnalyzeQueue implements IImageAnalyzeQueue {
    private readonly queueName = 'image-analyze-queue';
    private options = QueueConnectionsOptions

    private connection;
    private _dataStorage: IDataStorage;
    private _parser: IParser;
    private _gv: IGoogleVision;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IParser) parser: IParser,
        @inject(TYPES.IGoogleVision) gv: IGoogleVision) {
        this._dataStorage = dataStorage;
        this._parser = parser;
        this._gv = gv;

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
                const messages = await this._dataStorage.getAllImages();

                messages.forEach(async(image) => {
                    if(image.externalUrl) {
                        return ch.sendToQueue(this.queueName, Buffer.from(JSON.stringify(image)));
                    }
                })
            }).then(() => ch.close());
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
                        
                        const image = <Image>JSON.parse(messageContent);

                        console.log(`analyzing ${image.externalUrl}`);

                        const labels = await this._gv.analyze(image.externalUrl);
                        console.log(labels);
                        image.labels = JSON.stringify(labels);

                        await this._dataStorage.updateImage(image);
                        ch.ack(msg);
                    }
                });
            });
        }).catch((ex) => {
            logger.crit("Exception oqqured while run /'consume/' in HtmlParseQueue: ", ex);
        });
    }
}
