import { Domain } from "../../entities";

export interface IDomainCrawl {
    crawl(domain: Domain): void;
}
