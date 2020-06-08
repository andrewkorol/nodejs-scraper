import { Domain } from "../../entities";


export interface IDomainCrawl {
    crawlByUrl(url: string): Promise<void>
    getDomains(): Promise<Array<Domain>>
}
