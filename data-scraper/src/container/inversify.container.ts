
import { Container } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawl, IDomainTechnology, IDomainCrawlQueue, IStartup, IHtmlGrabQueue, IParser, IStatistics } from "./interfaces";

//helpers
import { TYPES } from "./inversify-helpers/TYPES";

//instances
import { DataStorage } from "../data-storage/data-storage";
import { DomainCrawl } from "../core/domain-crawl/domain-crawl";
import { DomainTechnology } from "../services/domain-technology.service";
import { DomainCrawlQueue } from "../services/domain-crawl.queue";
import { Statistics } from "../services/statistics.service";
import { Startup } from "../core/startup";
import { HtmlGrabQueue } from "../services/html-grab.queue";
import { Parser } from "../core/parser/parser";
import { HtmlParseQueue } from "../services/html-parse.queue";
import { IHtmlParseQueue } from "./interfaces/html-parser-queue.interface";

const appContainer = new Container();
appContainer.bind<IDataStorage>(TYPES.IDataStorage).to(DataStorage);
appContainer.bind<IDomainCrawl>(TYPES.IDomainCrawl).to(DomainCrawl);
appContainer.bind<IDomainCrawlQueue>(TYPES.IDomainCrawlQueue).to(DomainCrawlQueue);
appContainer.bind<IDomainTechnology>(TYPES.IDomainTechnology).to(DomainTechnology);
appContainer.bind<IStartup>(TYPES.IStartup).to(Startup);
appContainer.bind<IHtmlGrabQueue>(TYPES.IHtmlGrabQueue).to(HtmlGrabQueue);
appContainer.bind<IParser>(TYPES.IParser).to(Parser);
appContainer.bind<IHtmlParseQueue>(TYPES.IHtmlParseQueue).to(HtmlParseQueue);
appContainer.bind<IStatistics>(TYPES.IStatistics).to(Statistics);

export { appContainer };
