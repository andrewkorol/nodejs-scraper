import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryColumn()
    id: string;

    @Column({
        length: 1000,
        nullable: true
    })
    productImages: string;

    @Column({
        length: 10000,
        nullable: true
    })
    productDascription: string;

    @Column({ nullable: true })
    sku: string;

    @Column({ nullable: true })
    productName: string;

    @Column({ nullable: true })
    price: string;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    tags: string;

    @Column({ nullable: true })
    metadata: string;

    @Column({ nullable: true })
    stockLevels: string;
}
