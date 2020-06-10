import { inject, injectable } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawlQueue, IStartup } from "../container/interfaces";

//entities
import { Domain } from "../entities";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";
import { crawl } from "../helpers/queue-handlers.ts/crawl.handler";
import { collectHtml } from "../helpers/queue-handlers.ts/collect-html.handler";

@injectable()
export class Startup implements IStartup {
    private _domainCrawlQueue: IDomainCrawlQueue;
    private _dataStorage: IDataStorage;

    constructor(@inject(TYPES.IDomainCrawlQueue) domainCrawlQueue: IDomainCrawlQueue,
    @inject(TYPES.IDataStorage) dataStorage: IDataStorage) {
        this._domainCrawlQueue = domainCrawlQueue;
        this._dataStorage = dataStorage;
    }

    public async start(): Promise<void> {
        await this._dataStorage.updateDomains(SOURCES);
        this._domainCrawlQueue.fire();
        // collectHtml('https://nonahandbags.com/products/fanny-pack-black');
    }
}