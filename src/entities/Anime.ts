import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Anime {
    @PrimaryColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("simple-json")
    main_picture!: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
    };

    @Column("text")
    synopsis!: string;

    @Column("float", { nullable: true })
    mean!: number;

    @Column({ nullable: true })
    rank!: number;

    @Column({ nullable: true })
    popularity!: number;

    @Column({ nullable: true })
    num_list_users!: number;

    @Column({ nullable: true })
    num_scoring_users!: number;

    @Column({ nullable: true })
    status!: string;

    @Column({ nullable: true })
    media_type!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}