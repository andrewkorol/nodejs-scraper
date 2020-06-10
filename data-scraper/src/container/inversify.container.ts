
import { Container } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawl, IDomainTechnology, IDomainCrawlQueue, IStartup, IHtmlGrabQueue } from "./interfaces";

//helpers
import { TYPES } from "./inversify-helpers/TYPES";

//instances
import { DataStorage } from "../data-storage/data-storage";
import { DomainCrawl } from "../core/domain-crawl/domain-crawl";
import { DomainTechnology } from "../services/domain-technology.service";
import { DomainCrawlQueue } from "../services/domain-crawl.queue";
import { Startup } from "../core/startup";
import { HtmlGrabQueue } from "../services/html-grab.queue";

const appContainer = new Container();
appContainer.bind<IDataStorage>(TYPES.IDataStorage).to(DataStorage);
appContainer.bind<IDomainCrawl>(TYPES.IDomainCrawl).to(DomainCrawl);
appContainer.bind<IDomainCrawlQueue>(TYPES.IDomainCrawlQueue).to(DomainCrawlQueue);
appContainer.bind<IDomainTechnology>(TYPES.IDomainTechnology).to(DomainTechnology);
appContainer.bind<IStartup>(TYPES.IStartup).to(Startup);
appContainer.bind<IHtmlGrabQueue>(TYPES.IHtmlGrabQueue).to(HtmlGrabQueue);

export { appContainer };
