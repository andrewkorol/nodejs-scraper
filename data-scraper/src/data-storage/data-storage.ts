import { Connection, createConnection, getConnection } from "typeorm";

import { Product } from "../entities/product-entity";
import { Domain } from '../entities/domain-entity';
import { Mapper } from "../helpers/mappers/mapper";
import { Link } from "../entities/link-entity";

export class DataStorage {
    private connection: Connection;

    public async init(): Promise<void> {
        try {
            this.connection = await createConnection();
            console.log("connected successfully")
        } catch (ex) {
            console.error(`Error: ${ex.message}`)
        }
    }

    public async updateDomains(sources: string[]): Promise<void> {
        await this.init();

        const repository = this.connection.getRepository(Domain);
        const domains: Array<Domain> =  Mapper.domainListToEntity(sources);

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

        console.log(links);
        const linksRepository = this.connection.getRepository(Link);

        try {
            await linksRepository.insert(links)
        }  catch (ex) {
            console.log('This link already exists!');
        }
    }

    public async updateOrInsertProduct(entities: Product[]) {
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