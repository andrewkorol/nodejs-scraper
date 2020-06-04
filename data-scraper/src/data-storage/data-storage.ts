import { Connection, createConnection, getConnection } from "typeorm";
import { injectable } from "inversify";

//entities
import { Product, Domain, Link } from "../entities"

//interfaces
import { IDataStorage } from "../container/interfaces/data-storage.interface";

//helpers
import { Mapper } from "../helpers/mappers/mapper";

@injectable()
export class DataStorage implements IDataStorage {
    private connection: Connection;

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

        const linksRepository = this.connection.getRepository(Link);

        console.log('updating links');

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
