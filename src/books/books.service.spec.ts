import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

describe('BooksService', () => {
  let service: BooksService;
  let repository: jest.Mocked<Repository<Book>>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<jest.Mocked<Repository<Book>>>(getRepositoryToken(Book));
  });

  //Create a book
  describe('create', () => {
    it('should create and return a new book', async () => {
      const createBookDto = {
        title: 'New Test Book',
        author: 'New Author',
        isbn: '978-1234567891',
        publisher: 'New Publisher',
        publishedDate: '2025-01-18T00:00:00Z',
        pageCount: 350,
        genres: ['non-fiction'],
      };
      const createdBook = { id: 1, ...createBookDto };

      repository.create.mockReturnValue(createdBook as Book);
      repository.save.mockResolvedValue(createdBook);

      const result = await service.create(createBookDto);

      expect(result).toEqual(createdBook);
      expect(repository.create).toHaveBeenCalledWith(createBookDto);
      expect(repository.save).toHaveBeenCalledWith(createdBook);
    });
  });

  //find all books
  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [
        {
          id: 1,
          title: 'Test Book',
          author: 'Test Author',
          isbn: '978-1234567890',
          publisher: 'Test Publisher',
          publishedDate: '2025-01-17T00:00:00Z',
          pageCount: 300,
          genres: ['fiction'],
        },
      ];
      repository.find.mockResolvedValue(books);

      const result = await service.findAll();

      expect(result).toEqual(books);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  //Find one book with id
  describe('findOne', () => {
    it('should return a single book', async () => {
      const book = {
        id: 1,
        title: 'Test Book',
        author: 'Test Author',
        isbn: '978-1234567890',
        publisher: 'Test Publisher',
        publishedDate: '2025-01-17T00:00:00Z',
        pageCount: 300,
        genres: ['fiction'],
      };
      repository.findOne.mockResolvedValue(book);

      const result = await service.findOne(1);

      expect(result).toEqual(book);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should return null if no book is found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });


  //Update one or mutltiples fiels in a book
  describe('update', () => {
    it('should update and return the updated book', async () => {
      const updateBookDto = { title: 'Updated Test Book' };
      const updatedBook = {
        id: 1,
        title: 'Updated Test Book',
        author: 'Test Author',
        isbn: '978-1234567890',
        publisher: 'Test Publisher',
        publishedDate: '2025-01-17T00:00:00Z',
        pageCount: 300,
        genres: ['fiction'],
      };
      repository.update.mockResolvedValue(null);
      repository.findOne.mockResolvedValue(updatedBook);

      const result = await service.update(1, updateBookDto);

      expect(result).toEqual(updatedBook);
      expect(repository.update).toHaveBeenCalledWith(1, updateBookDto);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  //Remove a book
  describe('remove', () => {
    it('should delete the book and return void', async () => {
      repository.delete.mockResolvedValue(null);

      await service.remove(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });
  });
});
