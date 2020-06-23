import { inject, injectable } from "inversify";


//interfaces
import { IDataStorage, IDomainCrawlQueue, IStartup, IHtmlGrabQueue, IParser, IStatistics } from "../container/interfaces";

//entities
import { Domain } from "../entities";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";
import { IHtmlParseQueue } from "../container/interfaces/html-parser-queue.interface";

// main class of the app
@injectable()
export class Startup implements IStartup {
    private _domainCrawlQueue: IDomainCrawlQueue;
    private _dataStorage: IDataStorage;
    private _htmlGrabQueue: IHtmlGrabQueue;
    private _htmlParseQueue: IHtmlParseQueue;
    private _statistics: IStatistics;

    constructor(@inject(TYPES.IDomainCrawlQueue) domainCrawlQueue: IDomainCrawlQueue,
        @inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IHtmlGrabQueue) htmlGrabQueue: IHtmlGrabQueue,
        @inject(TYPES.IHtmlParseQueue) htmlParseQueue: IHtmlParseQueue,
        @inject(TYPES.IStatistics) statistics: IStatistics,
        ) {
        this._domainCrawlQueue = domainCrawlQueue;
        this._dataStorage = dataStorage;
        this._htmlGrabQueue = htmlGrabQueue;
        this._htmlParseQueue = htmlParseQueue;
        this._statistics = statistics;
    }

    //method that runs the app
    public async start(): Promise<void> {
        // gets domains list from SOURCES constant and update domain table with it
        // await this._dataStorage.updateDomainsFromSources(SOURCES);

        // runs collecting of prodict links from all domains in DB
        // this._domainCrawlQueue.fire();

        // runs collecting html from product links
        // this._htmlGrabQueue.fire();

        // runs collecting products infirmation from all html's stored per each product link
        this._htmlParseQueue.fire();

        // this._statistics.calculate();
    }
}
