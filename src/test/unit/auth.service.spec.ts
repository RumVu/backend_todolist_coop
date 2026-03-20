import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../modules/auth/auth.repository';
import { AuthService } from '../../modules/auth/auth.service';

describe('AuthService unit', () => {
  let authRepository: AuthRepository;
  let authService: AuthService;

  beforeEach(() => {
    authRepository = new AuthRepository();
    authService = new AuthService(authRepository);
  });

  it('normalizes email and returns an access token when registering', () => {
    const response = authService.register({
      email: ' USER@Example.com ',
      name: 'User',
      username: 'user01',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    expect(response.message).toBe('Register successfully');
    expect(response.data.accessToken).toBeTruthy();
    expect(response.data.user.email).toBe('user@example.com');
  });

  it('rejects duplicate emails', () => {
    authService.register({
      email: 'user@example.com',
      name: 'User',
      username: 'user01',
      password: 'secret123',
      confirmPassword: 'secret123',
    });

    expect(() =>
      authService.register({
        email: 'user@example.com',
        name: 'User Two',
        username: 'user02',
        password: 'secret123',
        confirmPassword: 'secret123',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects mismatched password confirmation during registration', () => {
    expect(() =>
      authService.register({
        email: 'user@example.com',
        name: 'User',
        username: 'user01',
        password: 'secret123',
        confirmPassword: 'secret456',
      }),
    ).toThrow(BadRequestException);
  });

  it('rejects invalid login credentials', () => {
    expect(() =>
      authService.login({
        email: 'missing@example.com',
        password: 'secret123',
      }),
    ).toThrow(UnauthorizedException);
  });
});
