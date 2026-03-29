import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UsersRepository } from '../users/users.repository';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthRepository,
        UsersRepository,
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token'), verifyAsync: jest.fn() },
        },
        { provide: ConfigService, useValue: { getOrThrow: jest.fn().mockReturnValue('secret'), get: jest.fn().mockReturnValue('15') } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
