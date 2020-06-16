import { OpenGraphModel } from "../../models/open-graph.model";
import { Mapper } from "../../helpers/mappers/mapper";
import { Product } from "../../entities/product-entity";
import { inject, injectable } from "inversify";
import { TYPES } from "../../container/inversify-helpers/TYPES";
import { IDataStorage, IParser } from "../../container/interfaces";
import { ScrapeHtml } from "../html-scraper/scrape-html"
import { Link } from "../../entities";

var sitemaps = require('sitemap-stream-parser');
var ogs = require('open-graph-scraper');

const { parse } = require('parse-open-graph')
const cheerio = require('cheerio')

@injectable()
export class Parser implements IParser {
    private _dataStorage: IDataStorage;

    constructor(@inject(TYPES.IDataStorage) dataStorage: IDataStorage) {
        this._dataStorage = dataStorage;
    }

    public async parse(link: Link): Promise<void> {


        // const $ = cheerio.load(JSON.parse(link.html))
 
        // const meta = $('meta[property]').map((i, el) => ({
        //   property: $(el).attr('property'),
        //   content: $(el).attr('content')
        // })).get()
         
        // const result = parse(meta)

        // console.log(JSON.stringify(result))

        // const prodEntity = Mapper.OGModelToEntity(result.og)

        const data = {
            html: link.html,
            url: link.id,
            id: link.id,
        }

        // console.log('link info',data);
        const scrapeHtml = new ScrapeHtml(data);
        const product = scrapeHtml.getProduct();

        product.options = JSON.stringify(product.options)
        product.tags = JSON.stringify(product.tags)
        product.images = JSON.stringify(product.images)

        await this._dataStorage.updateProduct(product);
    }
}

