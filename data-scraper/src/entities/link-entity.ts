import { Entity, Column, PrimaryColumn, ManyToOne } from "typeorm";
import { Domain } from './domain-entity';

@Entity()
export class Link {
    @PrimaryColumn()
    id: string;

    @Column({
        length: 12000,
        nullable: true
    })
    html: string;

    @ManyToOne(type => Domain, domain => domain.links)
    domain: Domain;
}
