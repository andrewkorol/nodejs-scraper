import { Link } from "../../entities";
import { Mapper } from "../mappers/mapper";
import { appContainer } from "../../container/inversify.container";
import { IDataStorage } from "../../container/interfaces";
import { TYPES } from "../../container/inversify-helpers/TYPES";

var sitemaps = require('sitemap-stream-parser');

export function crawl(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            let sitemapUrls = [];

            sitemaps.parseSitemaps(url, (url) => { sitemapUrls.push(url); }, (err, sitemaps) => {
                if (err) {
                    reject(err);
                }

                const linkEntities: Array<Link> = Mapper.sitemapUrlsToEntity(sitemapUrls, url);
                const dataStorage = appContainer.get<IDataStorage>(TYPES.IDataStorage);
                
                dataStorage.updateDomainLinks(linkEntities, url)
                    .catch(reason => reject(reason))
                    .then(() => resolve());
            })
        })

}