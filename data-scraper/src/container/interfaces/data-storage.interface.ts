import { Domain, Link, Product } from "../../entities";

import { Source } from '../../models/sources.model';

export interface IDataStorage {
    init(): Promise<void>

    updateDomains(sources: Source[]): Promise<void>

    getDomains(): Promise<Domain[]>

    updateDomainLinks(links: Link[], domain: string): Promise<void>

    updateDomainLink(link: string, html: string): Promise<void>

    getAllLinks(): Promise<Link[]>

    getLink(id: string): Promise<Link>

    updateProduct(entity: Product): Promise<void>
}
