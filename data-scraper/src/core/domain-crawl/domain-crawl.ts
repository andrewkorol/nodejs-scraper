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

    public async crawl(): Promise<void> {
        const domains = await this.getDomains();

        //TODO: crawl from all domains
        await this.crawlByUrl(domains[0].id);
    }

    private crawlByUrl(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let sitemapUrls = [];

            sitemaps.parseSitemaps(url, (url) => { sitemapUrls.push(url); }, (err, sitemaps) => {
                if (err) {
                    reject(err);
                }

                sitemapUrls = sitemapUrls.filter((url) => {
                    if (url.includes('product')) {
                        return url;
                    }
                });

                const linkEntities: Array<Link> = Mapper.sitemapUrlsToEntity(sitemapUrls, url);

                this._dataStorage.updateDomainLinks(linkEntities, url)
                    .catch(reason => reject(reason))
                    .then(() => resolve());
            })
        })
    }

    private async getDomains(): Promise<Array<Domain>> {
        return await this._dataStorage.getDomains();
    }

}