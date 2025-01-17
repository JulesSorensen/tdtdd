import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

describe('BooksService', () => {
  let service: BooksService;
  let repository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    repository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const result = [{ id: 1, title: 'Test Book', author: 'Author' }];
      jest.spyOn(repository, 'find').mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single book', async () => {
      const result = {
        id: 1,
        isbn: '978-0321765723',
        title: 'Test Book',
        author: 'Author',
        publisher: 'Publisher',
        publishedDate: '2025-01-01',
        pageCount: 472,
        description: 'A test book description',
        genres: ['Fiction', 'Adventure'],
      };
  
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);
  
      expect(await service.findOne(1)).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create and return a book', async () => {
      const createBookDto = { isbn: '123', title: 'Test Book', author: 'Author', publisher: 'Publisher', publishedDate: '2025-01-01', pageCount: 100, genres: [] };
      const result = { id: 1, ...createBookDto };
      jest.spyOn(repository, 'create').mockReturnValue(result);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(createBookDto)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update and return a book', async () => {
      const updateBookDto = { title: 'Updated Test Book' };
      const result = { id: 1, ...updateBookDto };
      jest.spyOn(repository, 'update').mockResolvedValue(null);
      jest.spyOn(repository, 'findOne').mockResolvedValue(result);

      expect(await service.update(1, updateBookDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue(null);
      expect(await service.remove(1)).toBeUndefined();
    });
  });
});
