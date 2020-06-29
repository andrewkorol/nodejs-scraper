import { injectable } from "inversify";

import { IDomainManagerService } from "../container/interfaces";

@injectable()
export class DomainManagerService implements IDomainManagerService {
    public domainToScrape: string;

    public manage(domain?: string): void {
        
    }
}