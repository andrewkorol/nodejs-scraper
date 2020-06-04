import { Link } from "../../entities/link-entity";
import { Mapper } from "../../helpers/mappers/mapper";
import { resolve } from "url";

var sitemaps = require('sitemap-stream-parser');

export class DomainCrawl {

    public crawl(url: string): Promise<Array<Link>> {
        return new Promise((resolve, reject) => {
            let sitemapUrls = [];
            let linkEntities: Array<Link>;
            sitemaps.parseSitemaps(url, (url) => { sitemapUrls.push(url); }, (err, sitemaps) => {
                sitemapUrls = sitemapUrls.filter((url) => {
                    if (url.includes('product')) {
                        return url;
                    }
                });
                
                linkEntities = Mapper.sitemapUrlsToEntity(sitemapUrls, url);

                resolve(linkEntities)
            })

            
        })
    }

}