import { Product } from "../../entities";

export interface IParser {
    parse(sitemapUrl: string)
}