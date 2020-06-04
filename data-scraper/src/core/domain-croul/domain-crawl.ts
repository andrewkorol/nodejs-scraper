import { Link } from "../../entities/link-entity";
import { Mapper } from "../../helpers/mappers/mapper";
import { resolve } from "url";

var sitemaps = require('sitemap-stream-parser');

export class DomainCrawl {
    public crawl(url: string): Promise<{ linkEntities: Array<Link>, domain: string }> {
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

                resolve(Object.assign({}, { linkEntities, domain: url }));
            })

        })
    }

}