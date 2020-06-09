
import { Container } from "inversify";

//interfaces
import { IDataStorage, IDomainCrawl, IDomainTechnology } from "./interfaces";

//helpers
import { TYPES } from "./inversify-helpers/TYPES";

//instances
import { DataStorage } from "../data-storage/data-storage";
import { DomainCrawl } from "../core/domain-crawl/domain-crawl";
import { DomainTechnology } from "../services/domain-technology.service";

const appContainer = new Container();
appContainer.bind<IDataStorage>(TYPES.IDataStorage).to(DataStorage);
appContainer.bind<IDomainCrawl>(TYPES.IDomainCrawl).to(DomainCrawl);
appContainer.bind<IDomainTechnology>(TYPES.IDomainTechnology).to(DomainTechnology);

export { appContainer };
