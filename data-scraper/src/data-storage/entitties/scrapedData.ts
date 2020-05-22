import {Entity, Column, PrimaryColumn} from "typeorm";

@Entity()
export class scrapedData {

    @PrimaryColumn()
    id: string;

    @Column()
    productImages: string;

    @Column()
    productDascription: string;

    @Column()
    sku: string;

    @Column()
    productName: string;

    @Column()
    price: string;

    @Column()
    currency: string;

    @Column()
    tags: string;

    @Column()
    metadata: string;

    @Column()
    stockLevels: string;

}
