import { Entity, Column, PrimaryColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Domain } from './domain-entity';
import { Product } from "./product-entity";

@Entity()
export class Link {
    @PrimaryColumn()
    id: string;

    @Column({
        type: "longtext",
        // length: 12000,
        nullable: true
    })
    html: string;

    // @Column({
    //     length: 12000,
    //     nullable: true
    // })
    // htmlFirstPart: string;

    // @Column({
    //     // length: 6000,
    //     nullable: true
    // })
    // htmlSecondPart: string;

    @Column()
    updated: string;

    @ManyToOne(type => Domain, domain => domain.links)
    domain: Domain;

    @OneToOne(type => Product)
    @JoinColumn()
    product: Product;
}
