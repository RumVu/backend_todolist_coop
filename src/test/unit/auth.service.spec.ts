import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../modules/auth/auth.repository';
import { AuthService } from '../../modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService unit', () => {
  let authRepository: AuthRepository;
  let authService: AuthService;

  beforeEach(() => {
    authRepository = new AuthRepository();
    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('token'),
      verifyAsync: jest.fn().mockResolvedValue({ exp: Math.floor(Date.now() / 1000) + 1000, tokenId: 'tid', type: 'refresh' }),
    } as unknown as JwtService;
    const configService = { getOrThrow: jest.fn().mockReturnValue('secret'), get: jest.fn().mockReturnValue('15') } as unknown as ConfigService;
    authService = new AuthService(authRepository, jwtService, configService);
  });

  it('normalizes email and returns an access token when registering', async () => {
    const response = await authService.register({
      email: ' USER@Example.com ',
      name: 'User',
      username: 'user01',
      password: 'secret123',
      confirmPassword: 'secret123',
    } as any);

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
    } as any);

    await expect(
      authService.register({
        email: 'user@example.com',
        name: 'User Two',
        username: 'user02',
        password: 'secret123',
        confirmPassword: 'secret123',
      } as any),
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
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects invalid login credentials', async () => {
    await expect(
      authService.login({
        email: 'missing@example.com',
        password: 'secret123',
      } as any),
    ).rejects.toThrow(UnauthorizedException);
  });
});
