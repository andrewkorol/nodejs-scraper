import { inject, injectable } from "inversify";

var sitemaps = require('sitemap-stream-parser');

//entities
import { Link, Domain } from "../../entities";

//interfaces
import { IDataStorage, IDomainCrawl } from "../../container/interfaces";

//mappers
import { Mapper } from "../../helpers/mappers/mapper";
import { TYPES } from "../../container/inversify-helpers/TYPES";

@injectable()
export class DomainCrawl implements IDomainCrawl {
    private _dataStorage: IDataStorage;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage) {
        this._dataStorage = dataStorage;
    }

    public crawlByUrl(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let sitemapUrls = [];

            sitemaps.parseSitemaps(url, (url) => { sitemapUrls.push(url); }, (err, sitemaps) => {
                if (err) {
                    reject(err);
                }

                const linkEntities: Array<Link> = Mapper.sitemapUrlsToEntity(sitemapUrls, url);

                this._dataStorage.updateDomainLinks(linkEntities, url.replace('/sitemap.xml', ''))
                    .catch(reason => reject(reason))
                    .then(() => resolve());
            })
        })
    }

    public async getDomains(): Promise<Array<Domain>> {
        return await this._dataStorage.getDomains();
    }

}
