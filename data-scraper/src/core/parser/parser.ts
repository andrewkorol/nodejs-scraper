import { OpenGraphModel } from "../../models/open-graph.model";
import { Mapper } from "../../helpers/mappers/mapper";
import { Product } from "../../entities/product-entity";
import { inject, injectable } from "inversify";
import { TYPES } from "../../container/inversify-helpers/TYPES";
import { IDataStorage, IParser } from "../../container/interfaces";

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

    public async parse(html: string): Promise<void> {
        const $ = cheerio.load(JSON.parse(html))
 
        const meta = $('meta[property]').map((i, el) => ({
          property: $(el).attr('property'),
          content: $(el).attr('content')
        })).get()
         
        const result = parse(meta)
        const prodEntity = Mapper.OGModelToEntity(result.og)
        
        await this._dataStorage.updateProduct(prodEntity);
    }
}
