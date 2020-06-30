import { inject, injectable } from "inversify";


//interfaces
import { IDataStorage, IDomainCrawlQueue, IStartup, IHtmlGrabQueue, IParser, IStatistics, IImageAnalyzeQueue, IDomainManagerService } from "../container/interfaces";

//entities
import { Domain } from "../entities";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";
import { IHtmlParseQueue } from "../container/interfaces/html-parser-queue.interface";
import { GoogleVision } from "../services/google-vision.service";

// main class of the app
@injectable()
export class Startup implements IStartup {
    private _domainCrawlQueue: IDomainCrawlQueue;
    private _dataStorage: IDataStorage;
    private _htmlGrabQueue: IHtmlGrabQueue;
    private _htmlParseQueue: IHtmlParseQueue;
    private _statistics: IStatistics;
    private _imageAnalyzeQueue: IImageAnalyzeQueue;
    private _domainManagerService: IDomainManagerService;

    constructor(@inject(TYPES.IDomainCrawlQueue) domainCrawlQueue: IDomainCrawlQueue,
        @inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IHtmlGrabQueue) htmlGrabQueue: IHtmlGrabQueue,
        @inject(TYPES.IHtmlParseQueue) htmlParseQueue: IHtmlParseQueue,
        @inject(TYPES.IStatistics) statistics: IStatistics,
        @inject(TYPES.IImageAnalyzeQueue) imageAnalyzeQueue: IImageAnalyzeQueue,
        @inject(TYPES.IDomainManagerService) domainManagerService: IDomainManagerService
        ) {
        this._domainCrawlQueue = domainCrawlQueue;
        this._dataStorage = dataStorage;
        this._htmlGrabQueue = htmlGrabQueue;
        this._htmlParseQueue = htmlParseQueue;
        this._statistics = statistics;
        this._imageAnalyzeQueue = imageAnalyzeQueue;
        this._domainManagerService = domainManagerService;
    }

    //method that runs the app
    public async start(): Promise<void> {
        // gets domains list from SOURCES constant and update domain table with it
        // await this._dataStorage.updateDomainsFromSources(SOURCES);

        // await this._domainManagerService.manage('https://deborahlyons.co.uk');

        // runs collecting of prodict links from all domains in DB
        // this._domainCrawlQueue.fire();

        // runs collecting html from product links
        // this._htmlGrabQueue.fire();

        // runs collecting products infirmation from all html's stored per each product link
        this._htmlParseQueue.fire();

        // this._imageAnalyzeQueue.fire();
        // this._imageAnalyzeQueue.test('https://static1.squarespace.com/static/5bf01f243c3a53612e1d39aa/5bf12d39cd836636ea510528/5e2b232aeee42a6835171019/1586437053749/?format=1500w');

        // this._statistics.calculate();

    }
}
