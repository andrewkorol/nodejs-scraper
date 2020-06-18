import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Product {

    @PrimaryColumn()
    id: string;

    @Column({
        length: 1000,
        nullable: true
    })
    images: string;

    @Column({
        length: 10000,
        nullable: true
    })
    description: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    available: boolean;

    @Column({ nullable: true })
    options: string;

    @Column({ nullable: true })
    brand: string;

    @Column({ nullable: true })
    price: string;

    @Column({ nullable: true })
    currency: string;

    @Column({ nullable: true })
    tags: string;

    @Column({ nullable: true })
    breadcrumps: string;

    @Column()
    updated: string;
}
