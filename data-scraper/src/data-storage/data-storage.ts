import { Connection, createConnection, getConnection } from "typeorm";
import { injectable, inject } from "inversify";

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

        console.log('updating domains');
        try {
            await repository.save(domains)
        } catch (ex) {
            console.log(ex);
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
        await repositoryProduct.save(entity);

        const repositoryLink = this.connection.getRepository(Link);
        let link = await repositoryLink.findOne(entity.id);
        link.product = entity;

        console.log(`update ${entity.id} with collected product data`);

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

        console.log(`updating links for ${domain}`)

        try {
            await linksRepository.save(links)
        } catch (ex) {
            console.log(ex);
        }
    }

    public async updateDomainLink(link: string, html: string): Promise<void> {
        await this.init();
        const linksRepository = this.connection.getRepository(Link);
        let linkEntity = await linksRepository.findOne(link);

        if (!linkEntity) {
            console.log('No such entity');

            return;
        }

        let htmlAsString = JSON.stringify(html);

        linkEntity.html = htmlAsString;

        console.log(`inserting html for ${link}`);

        try {
            await linksRepository.save(linkEntity);
        } catch  (ex) {
            console.log("ERROR: ", ex);
        }

    }

    public async updateOrInsertProduct(entities: Product[]): Promise<void> {
        await this.init();

        const repository = this.connection.getRepository(Product);

        console.log('inserting in DB');
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                const spliseCount = entities.length < 10 ? entities.length : 100;
                const entitiesToInsert = entities.splice(0, spliseCount);

                console.log(`${entities.length} left`);
                repository.insert(entitiesToInsert)
                    .then(() => {
                        if (entities.length === 0) {
                            clearInterval(interval)
                            resolve();
                        }
                    })
                    .catch((ex) => { })


            }, 3000);
        });

    }
}
