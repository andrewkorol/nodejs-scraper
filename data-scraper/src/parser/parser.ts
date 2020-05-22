import { SOURCES } from "../helpers/sources";

var sitemaps = require('sitemap-stream-parser');

export class Parser {
    private sitemapUrls: Array<string> = [];

    public parse() {
        this.parseSitemap(SOURCES[0]);
    }

    private parseSitemap(url: string) {
        sitemaps.parseSitemaps(url, (url) => { this.sitemapUrls.push(url); }, (err, sitemaps) => {
            const onlyProducts = this.sitemapUrls.filter((url) => {
                if (url.includes('product')) {
                    return url;
                }
            });

            console.log(onlyProducts)
        });
    }
}