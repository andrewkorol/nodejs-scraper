import { Connection, createConnection, getConnection } from "typeorm";
import { injectable, inject } from "inversify";

//entities
import { Product, Domain, Link } from "../entities"

//interfaces
import { IDataStorage,IDomainTechnology } from "../container/interfaces";

//helpers
import { Mapper } from "../helpers/mappers/mapper";
import { TYPES } from "../container/inversify-helpers/TYPES";
import { DomainTechnology } from "../services/domain-technology.service";

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

    public async updateDomains(sources: string[]): Promise<void> {
        await this.init();

        const repository = this.connection.getRepository(Domain);
        const domains: Array<Domain> =  await this._domainTechnology.getDomainEntities(sources);
        
        try {
            await repository.insert(domains)
        }  catch (ex) {
            console.log('This domain already exists!');
        }
    }
    
    public async getDomains(): Promise<Domain[]> {
        await this.init();

        const repository = this.connection.getRepository(Domain);

        return repository.find();
    }

    public async updateDomainLinks(links: Link[], domain: string): Promise<void> {
        await this.init();

        const domainsRepository = this.connection.getRepository(Domain);
        const domainEntity = await domainsRepository.findOne(domain);

        links.forEach((link) => {
            link.domain = domainEntity;
        });

        const linksRepository = this.connection.getRepository(Link);

        console.log('updating links');

        try {
            await linksRepository.insert(links)
        }  catch (ex) {
            console.log('This link already exists!');
        }
    }

    public async updateDomainLink(link: string, html: string): Promise<void> {
        await this.init();
        const linksRepository = this.connection.getRepository(Link);

        let linkEntity = await linksRepository.findOne(link);

        if(!linkEntity) {
            console.log('No such entity');
            
            return;
        }

        let htmlAsString = JSON.stringify(html);

        const htmlFirst = htmlAsString.slice(0, htmlAsString.length/2);
        const htmlSecond = htmlAsString.slice(htmlAsString.length/2);
        
        // linkEntity.htmlFirstPart = htmlFirst;
        // linkEntity.htmlSecondPart = htmlSecond;

        console.log('linkEntity', linkEntity);

        await linksRepository.save(linkEntity);

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
