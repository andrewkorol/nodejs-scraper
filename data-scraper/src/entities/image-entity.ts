import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from "typeorm";
import { Product } from "./product-entity";

@Entity()
export class Image {

    @PrimaryColumn()
    id: string;

    @Column({
        length: 1000,
        nullable: true
    })
    externalUrl: string;

    @Column({ nullable: true })
    labels: string;

    @Column({ nullable: true })
    tags: string;

    @Column({ nullable: true })
    productShot: boolean;

    @Column({ nullable: true })
    check: boolean;

    @Column({ nullable: true })
    domain: string;

    @Column({ nullable: true })
    checkTransparent: number;

    @ManyToOne(type => Product, product => product.images)
    product: Product;

    @Column()
    updated: string;
}
