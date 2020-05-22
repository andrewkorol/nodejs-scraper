import { Connection, createConnection, getConnection } from "typeorm";

import { Product } from "../entity/product-entity";

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