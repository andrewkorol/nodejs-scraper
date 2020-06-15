import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany } from "typeorm";

import { Link } from './link-entity';

@Entity()
export class Domain {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    coreLink: string;

    @Column({ nullable: true })
    technology: string;

    @Column({ nullable: true })
    productRegExp: string;

    @Column()
    updated: string;

    @OneToMany(type => Link, link => link.domain)
    links: Link[];
}
