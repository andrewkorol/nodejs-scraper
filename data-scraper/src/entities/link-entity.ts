import { Entity, Column, PrimaryColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { Domain } from './domain-entity';
import { Product } from "./product-entity";

@Entity()
export class Link {
    @PrimaryColumn()
    id: string;

    @Column({
        type: "longtext",
        nullable: true
    })
    html: string;

    @Column({ nullable: true })
    staistic: number;

    @Column({ nullable: true })
    unique: boolean;

    @Column()
    updated: string;

    @ManyToOne(type => Domain, domain => domain.links)
    domain: Domain;

    @OneToOne(type => Product)
    @JoinColumn()
    product: Product;
}
