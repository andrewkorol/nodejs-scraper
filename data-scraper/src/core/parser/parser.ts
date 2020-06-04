import { OpenGraphModel } from "../../models/open-graph.model";
import { Mapper } from "../../helpers/mappers/mapper";
import { Product } from "../../entities/product-entity";

var sitemaps = require('sitemap-stream-parser');
var ogs = require('open-graph-scraper');

export class Parser {
    public productEntities: Array<Product>;

    private sitemapUrls: Array<string> = [];
    private productList: Array<OpenGraphModel> = [];

    public async parse(sitemapUrl: string): Promise<Array<Product>> {
        console.log(sitemapUrl);
        return this.getProductsFromUrl(sitemapUrl);
    }

    private getProductsFromUrl(url: string): Promise<Array<Product>> {
        return new Promise((resolve, reject) => {
            sitemaps.parseSitemaps(url, (url) => { this.sitemapUrls.push(url); }, async (err, sitemaps) => {
                this.sitemapUrls = this.sitemapUrls.filter((url) => {
                    if (url.includes('product')) {
                        return url;
                    }
                });

                await this.scrapeAllSource();

                const entities = this.productList.map((product) => {
                    return Mapper.OGModelToEntity(product);
                })

                resolve(entities)
            });
        })

    }

    private parseProductLink(links: string[]) {
        return new Promise((resolve, reject) => {
            links.forEach((link, index) => {
                const options = { 'url': link };

                ogs(options)
                    .then((results: { data: OpenGraphModel }) => {
                        this.productList.push(results.data);
                        console.log(`collected ${this.productList.length} records`)

                        if (index === links.length - 1) {
                            resolve();
                        }
                    })
                    .catch(function (error) {

                    });
            })
        })
    }

    private scrapeAllSource(): Promise<void> {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                const spliseCount = this.sitemapUrls.length < 10 ? this.sitemapUrls.length : 10;
                const urlsGroup: Array<string> = this.sitemapUrls.splice(0, spliseCount);

                await this.parseProductLink(urlsGroup);

                if (this.sitemapUrls.length === 0) {
                    clearInterval(interval)
                    resolve();
                }
            }, 2000);
        });

    }


}