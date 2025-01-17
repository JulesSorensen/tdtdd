import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>,
    ) { }

    async findAll(): Promise<Book[]> {
        return this.booksRepository.find();
    }

    async findOne(id: number): Promise<Book> {
        return this.booksRepository.findOne({ where: { id } });
    }

    async create(createBookDto: CreateBookDto): Promise<Book> {
        const book = this.booksRepository.create(createBookDto);
        return this.booksRepository.save(book);
    }

    async update(id: number, updateBookDto: UpdateBookDto): Promise<Book> {
        await this.booksRepository.update(id, updateBookDto);
        return this.booksRepository.findOne({ where: { id } });
    }

    async remove(id: number): Promise<void> {
        await this.booksRepository.delete(id);
    }
}
