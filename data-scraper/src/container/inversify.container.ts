
import { Container } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawl, IDomainTechnology, IDomainCrawlQueue, IStartup, IHtmlGrabQueue, IParser, IStatistics, IImageAnalyzeQueue, IGoogleVision } from "./interfaces";

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
import { ImageAnalyzeQueue } from "../services/image-analyze.queue";
import { GoogleVision } from "../services/google-vision.service";

const appContainer = new Container();
appContainer.bind<IParser>(TYPES.IParser).to(Parser);
appContainer.bind<IStartup>(TYPES.IStartup).to(Startup);
appContainer.bind<IStatistics>(TYPES.IStatistics).to(Statistics);
appContainer.bind<IDataStorage>(TYPES.IDataStorage).to(DataStorage);
appContainer.bind<IDomainCrawl>(TYPES.IDomainCrawl).to(DomainCrawl);
appContainer.bind<IHtmlGrabQueue>(TYPES.IHtmlGrabQueue).to(HtmlGrabQueue);
appContainer.bind<IHtmlParseQueue>(TYPES.IHtmlParseQueue).to(HtmlParseQueue);
appContainer.bind<IDomainCrawlQueue>(TYPES.IDomainCrawlQueue).to(DomainCrawlQueue);
appContainer.bind<IDomainTechnology>(TYPES.IDomainTechnology).to(DomainTechnology);
appContainer.bind<IImageAnalyzeQueue>(TYPES.IImageAnalyzeQueue).to(ImageAnalyzeQueue);
appContainer.bind<IGoogleVision>(TYPES.IGoogleVision).to(GoogleVision);

export { appContainer };
