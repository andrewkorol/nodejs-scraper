import { inject, injectable } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawlQueue, IStartup, IHtmlGrabQueue } from "../container/interfaces";

//entities
import { Domain } from "../entities";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";

@injectable()
export class Startup implements IStartup {
    private _domainCrawlQueue: IDomainCrawlQueue;
    private _dataStorage: IDataStorage;
    private _htmlGrabQueue: IHtmlGrabQueue;

    constructor(@inject(TYPES.IDomainCrawlQueue) domainCrawlQueue: IDomainCrawlQueue,
    @inject(TYPES.IDataStorage) dataStorage: IDataStorage,
    @inject(TYPES.IHtmlGrabQueue) htmlGrabQueue: IHtmlGrabQueue) {
        this._domainCrawlQueue = domainCrawlQueue;
        this._dataStorage = dataStorage;
        this._htmlGrabQueue = htmlGrabQueue;
    }

    public async start(): Promise<void> {
        await this._dataStorage.updateDomains(SOURCES);
        this._domainCrawlQueue.fire();
        // this._htmlGrabQueue.fire();
        // collectHtml('https://nonahandbags.com/products/fanny-pack-black');
    }
}