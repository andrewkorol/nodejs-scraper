import { Connection } from "typeorm";
import { Domain, Link, Product } from "../../entities";

export interface IDataStorage {
      init(): Promise<void>

      updateDomains(sources: string[]): Promise<void> 
    
      getDomains(): Promise<Domain[]> 
    
      updateDomainLinks(links: Link[], domain: string): Promise<void> 
    
      updateOrInsertProduct(entities: Product[]) 

}
