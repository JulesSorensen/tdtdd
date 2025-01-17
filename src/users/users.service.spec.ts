import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let createdUser: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [User],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    const user = new User();
    user.name = 'A';
    user.email = 'A';
    user.password = 'A';

    createdUser = await repository.save(user);
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

      const data = await service.create(userDto);
      expect(data).toBeDefined();
      expect(data.name).toEqual(userDto.name);
      expect(data.email).toEqual(userDto.email);
    });
  });

  describe('findAll', () => {
    it('should return users', async () => {
      const users = await service.findAll();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('findUserById', () => {
    it('should return a user by ID', async () => {
      const result = {
        name: 'A',
      };

      const updated = await service.findOne(createdUser.id);
      expect(updated).toBeDefined();
      expect(updated.name).toBe(result.name);
    });

    it('should return null if user not found', async () => {
      expect(await service.findOne(999)).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const result = {
        name: 'Salut',
      };

      const updated = await service.update(createdUser.id, result);
      expect(updated).toBeDefined();
      expect(updated.name).toBe(result.name);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      expect(await service.remove(createdUser.id)).toEqual(true);
    });

    it('should return false if user not found', async () => {
      expect(await service.remove(999)).toEqual(false);
    });
  });
});
