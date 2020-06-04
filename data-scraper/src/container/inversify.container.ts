
import { Container } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawl } from "./interfaces";

//helpers
import { TYPES } from "./inversify-helpers/TYPES";

//instances
import { DataStorage } from "../data-storage/data-storage";
import { DomainCrawl } from "../core/domain-crawl/domain-crawl";

const appContainer = new Container();
appContainer.bind<IDataStorage>(TYPES.IDataStorage).to(DataStorage);
appContainer.bind<IDomainCrawl>(TYPES.IDomainCrawl).to(DomainCrawl);

export { appContainer };