
import { Container } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawl, IDomainTechnology, IQueueService, IStartup } from "./interfaces";

//helpers
import { TYPES } from "./inversify-helpers/TYPES";

//instances
import { DataStorage } from "../data-storage/data-storage";
import { DomainCrawl } from "../core/domain-crawl/domain-crawl";
import { DomainTechnology } from "../services/domain-technology.service";
import { QueueService } from "../services/queue.service";
import { Startup } from "../core/startup";

const appContainer = new Container();
appContainer.bind<IDataStorage>(TYPES.IDataStorage).to(DataStorage);
appContainer.bind<IDomainCrawl>(TYPES.IDomainCrawl).to(DomainCrawl);
appContainer.bind<IQueueService>(TYPES.IQueueService).to(QueueService);
appContainer.bind<IDomainTechnology>(TYPES.IDomainTechnology).to(DomainTechnology);
appContainer.bind<IStartup>(TYPES.IStartup).to(Startup);

export { appContainer };
