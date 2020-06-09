import { inject, injectable } from "inversify";

//interfaces
import { IDataStorage, IQueueService, IStartup } from "../container/interfaces";

//entities
import { Domain } from "../entities";

//helpers
import { TYPES } from "../container/inversify-helpers/TYPES";
import { SOURCES } from "../helpers/sources";
import { crawl } from "../helpers/queue-handlers.ts/crawl.handler";
import { collectHtml } from "../helpers/queue-handlers.ts/collect-html.handler";

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
        const domains: Array<Domain> = await this._dataStorage.getDomains();

        const domainUrls = domains.map((domain: Domain) => {
            return `${domain.id}/sitemap.xml`;
        })

        this._queueService.produse(domainUrls);
        this._queueService.consume(crawl);

        this._queueService.produse(['https://nonahandbags.com/products/fanny-pack-black']);
        this._queueService.consume(collectHtml);

        // collectHtml('https://nonahandbags.com/products/fanny-pack-black');
    }
}