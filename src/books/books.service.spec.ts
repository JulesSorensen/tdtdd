import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;
  let createdBook: Book;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Book],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Book]),
      ],
      providers: [BooksService],
      controllers: [BooksController],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));

    const book = new Book();
    book.title = 'Test Book';
    book.author = 'Test Author';
    book.isbn = '978-1234567890';
    book.publisher = 'Test Publisher';
    book.publishedDate = '2025-01-17T00:00:00Z';
    book.pageCount = 300;
    book.genres = ['fiction'];

    createdBook = await repository.save(book);
  });

  it('should create a book', async () => {
    const newBook = await service.create({
      title: 'New Test Book',
      author: 'New Author',
      isbn: '978-1234567891',
      publisher: 'New Publisher',
      publishedDate: '2025-01-18T00:00:00Z',
      pageCount: 350,
      genres: ['non-fiction'],
    });
    expect(newBook).toBeDefined();
    expect(newBook.title).toBe('New Test Book');
    expect(newBook.author).toBe('New Author');
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = await service.findAll();
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Test Book');
      expect(books[0].publishedDate).toBe('2025-01-17T00:00:00Z');
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const foundBook = await service.findOne(createdBook.id);
      expect(foundBook).toBeDefined();
      expect(foundBook.title).toBe('Test Book');
      expect(foundBook.publishedDate).toBe('2025-01-17T00:00:00Z');
    });
  });

  describe('update', () => {
    it('should update and return a book', async () => {
      const updateBookDto = { title: 'Updated Test Book' };
      const updatedBook = await service.update(createdBook.id, updateBookDto);
      expect(updatedBook.title).toBe('Updated Test Book');
      expect(updatedBook.publishedDate).toBe('2025-01-17T00:00:00Z');
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      await service.remove(createdBook.id);
      const foundBook = await service.findOne(createdBook.id);
      expect(foundBook).toBeNull();
    });
  });
});
