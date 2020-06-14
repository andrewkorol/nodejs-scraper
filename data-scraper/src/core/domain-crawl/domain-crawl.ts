import { inject, injectable } from "inversify";

var sitemaps = require('sitemap-stream-parser');
const axios = require('axios');
const getHrefs = require('get-hrefs');
let logger = require('perfect-logger');

var Crawler = require("crawler");

//entities
import { Link } from "../../entities";

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

    public crawl(url: string): void {
         this._crawl(url);
    }

    private _crawl(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let sitemapUrls = [];

            sitemaps.parseSitemaps(`${url}/sitemap.xml`, (url) => { sitemapUrls.push(url); }, async (err, sitemaps) => {
                if (err) {
                    logger.crit("Exception oqqured while run /'parseSitemaps/': ", err);

                    reject(err);
                }

                if(sitemapUrls.length === 0) {
                    sitemapUrls = await this.crawlByStartPage(url);
                }

                const linkEntities: Array<Link> = Mapper.sitemapUrlsToEntity(sitemapUrls, url);

                this._dataStorage.updateDomainLinks(linkEntities, url)
                    .catch(reason => {
                        logger.crit("Exception oqqured while run /'crawl/': ", reason);
                        reject(reason)
                    })
                    .then(() => resolve());
            })
        })
    }

    private async crawlByStartPage(url) {
     const res = await axios.get(url);
     const links = getHrefs(res.data);

     return links;
    }


}
