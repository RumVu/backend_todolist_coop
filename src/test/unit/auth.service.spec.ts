import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../modules/auth/auth.repository';
import { UsersRepository } from '../../modules/users/users.repository';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from '../../modules/auth/dto/register.dto';
import { LoginDto } from '../../modules/auth/dto/login.dto';

describe('AuthService unit', () => {
  let authRepository: AuthRepository;
  let usersRepository: UsersRepository;
  let authService: AuthService;

  beforeEach(() => {
    type MockUser = {
      id: string;
      name: string;
      username: string;
      email: string;
      phoneNum: string | null;
      isActive: boolean;
      passwordHash: string;
      createdAt: Date;
      updatedAt: Date;
      roles: Array<{ role: { name: string } }>;
    };

    const mockUsers: MockUser[] = [];
    authRepository = {
      saveRefreshToken: jest.fn(),
      deleteRefreshTokenByUserId: jest.fn(),
      findRefreshTokenById: jest.fn(),
    } as unknown as AuthRepository;
    usersRepository = {
      findByEmail: jest.fn(
        async (e) => mockUsers.find((u) => u.email === e) || null,
      ),
      findByUsername: jest.fn(
        async (u) => mockUsers.find((x) => x.username === u) || null,
      ),
      create: jest.fn(async (u) => {
        const user: MockUser = {
          ...u,
          id: 'u1',
          phoneNum: u.phoneNum ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          roles: [{ role: { name: 'user' } }],
        };
        mockUsers.push(user);
        return user;
      }),
      findById: jest.fn(
        async (id) => mockUsers.find((user) => user.id === id) || null,
      ),
    } as unknown as UsersRepository;
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
      verifyAsync: jest.fn().mockResolvedValue({
        exp: Math.floor(Date.now() / 1000) + 1000,
        tokenId: 'tid',
        type: 'refresh',
      }),
    } as unknown as JwtService;
    const configService = {
      getOrThrow: jest.fn().mockReturnValue('secret'),
      get: jest.fn().mockReturnValue('15'),
    } as unknown as ConfigService;
    authService = new AuthService(
      authRepository,
      usersRepository,
      jwtService,
      configService,
    );
  });

  it('normalizes email and returns an access token when registering', async () => {
    const response = await authService.register({
      email: ' USER@Example.com ',
      name: 'User',
      username: 'user01',
      password: 'secret123',
      confirmPassword: 'secret123',
    } satisfies RegisterDto);

    expect(response.message).toBe('User registered successfully');
    expect(response.tokens.accessToken).toBeTruthy();
    expect(response.data.userAccount.email).toBe('user@example.com');
  });

  it('rejects duplicate emails', async () => {
    await authService.register({
      email: 'user@example.com',
      name: 'User',
      username: 'user01',
      password: 'secret123',
      confirmPassword: 'secret123',
    } satisfies RegisterDto);

    await expect(
      authService.register({
        email: 'user@example.com',
        name: 'User Two',
        username: 'user02',
        password: 'secret123',
        confirmPassword: 'secret123',
      } satisfies RegisterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects mismatched password confirmation during registration', async () => {
    await expect(
      authService.register({
        email: 'user@example.com',
        name: 'User',
        username: 'user01',
        password: 'secret123',
        confirmPassword: 'secret456',
      } satisfies RegisterDto),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects invalid login credentials', async () => {
    await expect(
      authService.login({
        email: 'missing@example.com',
        password: 'secret123',
      } satisfies LoginDto),
    ).rejects.toThrow(UnauthorizedException);
  });
});
