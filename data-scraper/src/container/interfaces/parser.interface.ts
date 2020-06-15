import { Link } from "../../entities";

export interface IParser {
    parse(sitemapUrl: Link)
}