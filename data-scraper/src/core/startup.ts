import { inject, injectable } from "inversify";

//interfaces
import { IDataStorage, IQueueService, IStartup } from "../container/interfaces";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";
import { crawl } from "../helpers/queue-handlers.ts/crawl.handler";

@injectable()
export class Startup implements IStartup {
    private _dataStorage: IDataStorage;
    private _queueService: IQueueService;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage,
        @inject(TYPES.IQueueService) queueService: IQueueService, ) {
        this._dataStorage = dataStorage;
        this._queueService = queueService;
    }

    public async start(): Promise<void> {
        await this._dataStorage.updateDomains(SOURCES);
        const domains = await this._dataStorage.getDomains();

        this._queueService.produse(domains);
        this._queueService.consume(crawl);
    }
}