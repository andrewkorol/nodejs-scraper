import { injectable, inject } from "inversify";

import { IDomainManagerService, IDataStorage } from "../container/interfaces";
import { ScrapeSteps } from "../helpers/scrape-steps.enum";
import { TYPES } from "../container/inversify-helpers/TYPES";
import { Domain } from "../entities";

@injectable()
export class DomainManagerService implements IDomainManagerService {
    private domainToScrape: Domain;

    private _dataStorage: IDataStorage;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage) {
        this._dataStorage = dataStorage;
    }

    public async manage(domain?: string, step?: ScrapeSteps): Promise<void> {
        if (!step) {
            let uniqueEntity: Domain = await this._dataStorage.getDomain(domain);
            uniqueEntity.unique = true;

            await this._dataStorage.saveDomain(uniqueEntity);
        } else {
            this.domainToScrape = await this._dataStorage.getUniqueDomainWithRelations();
        }
    }

    public getDomainToScrape(): Domain {
        return this.domainToScrape ? this.domainToScrape : null;
    }

    public hasUniqueDomain(): boolean {
        return !!this.domainToScrape;
    }

    public async getUniqueDomain(): Promise<any> {
        const domain = await this._dataStorage.getUniqueDomainWithRelations();

        return domain ? domain.id : null;
    }

    public async getUniqueDomainLinks(): Promise<any> {
        const domain = await this._dataStorage.getUniqueDomainWithRelations();

        if (!domain) {
            return;
        }

        domain.links.forEach((link) => {
            link.domain = domain
        });

        return domain.links;
    }

    public async getUniqueLinksDomainRelation(): Promise<any> {
        const domain = await this._dataStorage.getUniqueDomainWithRelations();

        if (!domain) {
            return;
        }

        const linksObj = domain.links.map((link) => {
            return {
                link,
                domainId: domain.id
            }
        });

        return linksObj;
    }
}