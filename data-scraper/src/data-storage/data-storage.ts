import { Connection, createConnection, getConnection } from "typeorm";
import { injectable, inject } from "inversify";

let logger = require('perfect-logger');

//entities
import { Product, Domain, Link } from "../entities"

//interfaces
import { IDataStorage, IDomainTechnology } from "../container/interfaces";

//helpers
import { Mapper } from "../helpers/mappers/mapper";
import { TYPES } from "../container/inversify-helpers/TYPES";
import { DomainTechnology } from "../services/domain-technology.service";
import { Source } from "../models/sources.model";

@injectable()
export class DataStorage implements IDataStorage {
    private connection: Connection;
    private _domainTechnology: IDomainTechnology;

    constructor(@inject(TYPES.IDomainTechnology) domainTechnology: DomainTechnology) {
        this._domainTechnology = domainTechnology;
    }

    public async init(): Promise<void> {
        try {
            this.connection = await createConnection();
        } catch (ex) {
            this.connection = getConnection();
        }
    }

    public async updateDomains(sources: Array<Source>): Promise<void> {
        await this.init();

        const repository = this.connection.getRepository(Domain);
        const domains: Array<Domain> = await this._domainTechnology.getDomainEntities(sources);

        logger.info("Updating domains");
        try {
            await repository.save(domains)
        } catch (ex) {
            logger.crit("Exception oqqured while run /'updateDomains/': ", ex);
        }
    }

    public async getAllLinks(): Promise<Link[]> {
        await this.init();

        const repositoryLink = this.connection.getRepository(Link);

        return repositoryLink.find();
    }

    public async getLink(id: string): Promise<Link> {
        await this.init();

        const repositoryLink = this.connection.getRepository(Link);

        return repositoryLink.findOne(id);
    }

    public async getDomains(): Promise<Domain[]> {
        await this.init();

        const repository = this.connection.getRepository(Domain);

        return repository.find();
    }

    public async updateProduct(entity: Product): Promise<void> {
        await this.init();

        const repositoryProduct = this.connection.getRepository(Product); 
        entity.updated = Date.now().toString();

        await repositoryProduct.save(entity);

        const repositoryLink = this.connection.getRepository(Link);
        let link = await repositoryLink.findOne(entity.id);
        link.product = entity;

        logger.info(`update ${entity.id} with collected product data`);

        await repositoryLink.save(link);
    }

    public async updateDomainLinks(links: Link[], domain: string): Promise<void> {
        await this.init();

        const domainsRepository = this.connection.getRepository(Domain);
        const domainEntity = await domainsRepository.findOne(domain);

        links = links.filter(link => link.id.match(domainEntity.productRegExp));

        links.forEach((link: Link) => {
            link.domain = domainEntity;
            link.updated = Date.now().toString();
        });

        const linksRepository = this.connection.getRepository(Link);

        logger.info(`updating links for ${domain}`)

        try {
            await linksRepository.save(links)
        } catch (ex) {
            logger.crit("Exception oqqured while run /'updateDomainLinks/': ", ex);

        }
    }

    public async updateDomainLink(link: string, html: string): Promise<void> {
        await this.init();
        const linksRepository = this.connection.getRepository(Link);
        let linkEntity = await linksRepository.findOne(link);

        if (!linkEntity) {
            logger.info(`No such entity with id: `);

            return;
        }

        let htmlAsString = JSON.stringify(html);

        linkEntity.html = htmlAsString;

        logger.info(`inserting html for ${link}`);

        try {
            await linksRepository.save(linkEntity);
        } catch  (ex) {
            logger.crit("ERROR: ", ex);
        }

    }
}
