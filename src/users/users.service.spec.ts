import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const userDto: CreateUserDto = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'azerty',
      };
      const result = { id: 1, ...userDto };

      expect(await service.create(userDto)).toBe(result);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = { id: 1, name: 'John Doe', email: 'john@example.com' };

      // jest
      //   .spyOn(service, 'findUserById' as keyof UsersService)
      //   .mockImplementation(async () => result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should return null if user not found', async () => {
      jest
        .spyOn(service, 'findUserById' as keyof UsersService)
        .mockImplementation(async () => null);

      expect(await service.findOne(999)).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userDto = {
        name: 'John Doe Updated',
        email: 'john.updated@example.com',
      };
      const result = { id: 1, ...userDto };

      expect(await service.update(1, userDto)).toBe(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      jest
        .spyOn(service, 'deleteUser' as keyof UsersService)
        .mockImplementation(async () => true);

      expect(await service.remove(1)).toBe(true);
    });

    it('should return false if user not found', async () => {
      jest
        .spyOn(service, 'deleteUser' as keyof UsersService)
        .mockImplementation(async () => false);

      expect(await service.remove(999)).toBe(false);
    });
  });
});
