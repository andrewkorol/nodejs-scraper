import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Selector {

    @PrimaryColumn()
    id: string;

    @Column({ nullable: true })
    images: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    available: string;

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
}