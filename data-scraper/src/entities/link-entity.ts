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

    // @Column({
    //     length: 12000,
    //     nullable: true
    // })
    // htmlFirstPart: string;

    // @Column({
    //     length: 12000,
    //     nullable: true
    // })
    // htmlSecondPart: string;

    @Column()
    updated: string;

    @ManyToOne(type => Domain, domain => domain.links)
    domain: Domain;
}
