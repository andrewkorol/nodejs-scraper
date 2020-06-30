import { Entity, Column, PrimaryColumn, ManyToOne, OneToMany, OneToOne, JoinColumn, BaseEntity } from "typeorm";

import { Link } from './link-entity';
import { Selector } from "./selector-entity";

@Entity()
export class Domain  extends BaseEntity {
    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    coreLink: string;

    @Column({ nullable: true })
    technology: string;

    @Column({ nullable: true })
    productRegExp: string;

    @Column({ nullable: true })
    staistic: number;

    @Column({ nullable: true })
    unique: boolean;

    @Column()
    updated: string;

    @OneToMany(type => Link, link => link.domain)
    links: Link[];

    @OneToOne(type => Selector)
    @JoinColumn()
    selector: Selector;
}
