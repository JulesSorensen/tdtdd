import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findOneByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const user = { id: 1, email: 'jules@zide.fr' };
      const token = 'token';
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(user);
      expect(result).toEqual({ access_token: token });
    });
  });

  describe('validateUser', () => {
    it('should return user data if validation is successful', async () => {
      const user = {
        id: 1,
        email: 'jules@zide.fr',
        password: await bcrypt.hash('azertyuiop', 10),
      };
      mockUsersService.findOneByEmail.mockResolvedValue(user);

      const result = await service.validateUser('jules@zide.fr', 'azertyuiop');
      expect(result).toEqual({ id: 1, email: 'jules@zide.fr' });
    });

    it('should return null if validation fails', async () => {
      mockUsersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.validateUser('jules@zide.fr', 'azertyuiop');
      expect(result).toBeNull();
    });
  });
});
