import { inject, injectable } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawlQueue, IStartup, IHtmlGrabQueue, IParser } from "../container/interfaces";

//entities
import { Domain } from "../entities";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";
import { IHtmlParseQueue } from "../container/interfaces/html-parser-queue.interface";

@injectable()
export class Startup implements IStartup {
    private _domainCrawlQueue: IDomainCrawlQueue;
    private _dataStorage: IDataStorage;
    private _htmlGrabQueue: IHtmlGrabQueue;
    private _htmlParseQueue: IHtmlParseQueue;

    constructor(@inject(TYPES.IDomainCrawlQueue) domainCrawlQueue: IDomainCrawlQueue,
        @inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IHtmlGrabQueue) htmlGrabQueue: IHtmlGrabQueue,
        @inject(TYPES.IHtmlParseQueue) htmlParseQueue: IHtmlParseQueue) {
        this._domainCrawlQueue = domainCrawlQueue;
        this._dataStorage = dataStorage;
        this._htmlGrabQueue = htmlGrabQueue;
        this._htmlParseQueue = htmlParseQueue;
    }

    public async start(): Promise<void> {
        await this._dataStorage.updateDomains(SOURCES);
        // this._domainCrawlQueue.fire();
        // this._htmlGrabQueue.fire();
        this._htmlParseQueue.fire();
        // collectHtml('https://nonahandbags.com/products/fanny-pack-black');
    }
}