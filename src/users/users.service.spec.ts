import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userDto: CreateUserDto = {
        name: 'Jules Doe',
        email: 'jules@zide.fr',
        password: 'azertyuiop',
      };
      const result = { id: 1, ...userDto };

      mockUserRepository.create.mockReturnValue(result);
      mockUserRepository.save.mockResolvedValue(result);

      expect(await service.create(userDto)).toEqual(result);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(result);
    });
  });

  describe('findAll', () => {
    it('should return users', async () => {
      const result = [
        {
          id: 1,
          name: 'Jules Doe',
          email: 'jules@zide.fr',
          password: 'azertyuiop',
        },
      ];
      mockUserRepository.find.mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = {
        id: 1,
        name: 'Jules Doe',
        email: 'jules@zide.fr',
        password: 'azertyuiop',
      };
      mockUserRepository.findOne.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      expect(await service.findOne(999)).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userDto = {
        name: 'Jules Doe Updated',
        email: 'jules+updated@zide.fr',
      };
      const result = { id: 1, ...userDto };

      mockUserRepository.update.mockResolvedValue(result);
      mockUserRepository.findOne.mockResolvedValue(result);

      expect(await service.update(1, userDto)).toEqual(result);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, userDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      mockUserRepository.delete.mockResolvedValue(deleteResult);

      expect(await service.remove(1)).toEqual(true);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should return false if user not found', async () => {
      const deleteResult: DeleteResult = { affected: 0, raw: [] };
      mockUserRepository.delete.mockResolvedValue(deleteResult);

      expect(await service.remove(999)).toEqual(false);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(999);
    });
  });
});
