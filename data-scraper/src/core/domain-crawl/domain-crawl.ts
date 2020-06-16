import { inject, injectable } from "inversify";

var sitemaps = require('sitemap-stream-parser');
const axios = require('axios');
const getHrefs = require('get-hrefs');
let logger = require('perfect-logger');

var Crawler = require("crawler");

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

    public crawl(domain: Domain): void {
        this._crawl(domain);
    }

    private _crawl(domain: Domain): Promise<void> {
        return new Promise((resolve, reject) => {
            let sitemapUrls = [];

            sitemaps.parseSitemaps(`${domain.id}/sitemap.xml`, (url) => { sitemapUrls.push(url); }, async (err, sitemaps) => {
                if (err) {
                    logger.crit("Exception oqqured while run /'parseSitemaps/': ", err);

                    reject(err);
                }

                if (sitemapUrls.length === 0) {
                    sitemapUrls = await this.crawlByStartPage(domain);
                }

                const linkEntities: Array<Link> = Mapper.sitemapUrlsToEntity(sitemapUrls, domain.id);

                this._dataStorage.updateDomainLinks(linkEntities, domain)
                    .catch(reason => {
                        logger.crit("Exception oqqured while run /'crawl/': ", reason);
                        reject(reason)
                    })
                    .then(() => resolve());
            })
        })
    }

    private async crawlByStartPage(domain: Domain) {
        const res = await axios.get(domain.id);
        const linksFirstLevel = getHrefs(res.data);

        let linksSecondLevel = [];

        for (const link of linksFirstLevel) {
            if(link && link.match(domain.productRegExp)) {
                const res = await axios.get(`${domain.coreLink}/${link}`);
                linksSecondLevel.push(...getHrefs(res.data));
            }
        }

        const resultLinks = [...linksFirstLevel, ...linksSecondLevel];

        var uniqueLinks = [];
        
        for(let i=0; i < resultLinks.length; i++){
            if(uniqueLinks.indexOf(resultLinks[i]) === -1) {
                uniqueLinks.push(resultLinks[i]);
            }
        }

        return uniqueLinks;
    }


}
