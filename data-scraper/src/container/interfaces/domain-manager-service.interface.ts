import { ScrapeSteps } from "../../helpers/scrape-steps.enum";
import { Domain } from "../../entities";

export interface IDomainManagerService {
    manage(domain?: string): void
    getDomainToScrape(): Domain
    hasUniqueDomain(): boolean
    getUniqueDomain(): Promise<any> 
    getUniqueDomainLinks(): Promise<any>
    getUniqueLinksDomainRelation(): Promise<any> 
}