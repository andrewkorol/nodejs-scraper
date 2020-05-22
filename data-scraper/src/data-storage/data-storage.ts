import { Connection, createConnection } from "typeorm";

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
}