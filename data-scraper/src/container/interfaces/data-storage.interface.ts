import { Domain, Link, Product, Selector } from "../../entities";

import { Source } from '../../models/sources.model';

export interface IDataStorage {
    init(): Promise<void>

    updateDomainsFromSources(sources: Source[]): Promise<void>
    
    updateDomains(domains: Domain[]): Promise<void>

    getDomains(): Promise<Domain[]>

    updateDomainLinks(links: Link[], domain: Domain): Promise<void>

    updateDomainLink(link: string, html: string): Promise<void>

    getAllLinks(): Promise<Link[]>

    getLink(id: string): Promise<Link>

    updateProduct(entity: Product): Promise<void>

    getSelectors(domainId: string): Promise<Selector> 

    getAllLinksWithProducts(): Promise<Link[]>

    updateLinks(links: Link[]): Promise<void> 
}
