import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isbn: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    publisher: string;

    @Column()
    publishedDate: string;

    @Column()
    pageCount: number;

    @Column({ nullable: true })
    description?: string;

    @Column("simple-array")
    genres: string[];
}
