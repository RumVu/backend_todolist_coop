import { randomUUID } from 'crypto';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
import { UsersRepository, UserRecord } from '../users/users.repository';
import { buildRefreshTokenSave, toProfileAccount } from './auth.mapper';
import {
  hashPassword,
  comparePassword,
  hashValue,
} from '../../common/utils/hash.util';

export interface AuthResponse {
  message: string;
  data: {
    userAccount: {
      id: string;
      email: string;
      name: string;
      phoneNum?: string;
      isActive: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
  tokens: AuthTokens;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface RefreshTokenResponse {
  sub: string;
  email: string;
  name: string;
  tokenId: string;
  type: 'refresh';
}

interface AccessTokenResponse {
  sub: string;
  email: string;
  username: string;
  name: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  tokenID: string;
  type: 'access';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    const normalizedUsername = registerDto.username.trim().toLowerCase();
    const normalizedName = registerDto.name.trim();

    const existingUser =
      await this.usersRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new BadRequestException(
        `Email ${normalizedEmail} is already in use`,
      );
    }

    const rounds = parseInt(
      this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10',
      10,
    );
    const passwordHash = await hashPassword(registerDto.password, rounds);

    const userAccount = await this.usersRepository.create({
      email: normalizedEmail,
      name: normalizedName,
      username: normalizedUsername,
      phoneNum: registerDto.phoneNum || null,
      isActive: true,
      passwordHash,
      roles: {
        create: {
          role: { connect: { name: 'user' } },
        },
      },
    });

    const tokens = await this.generateTokens(userAccount);
    return {
      message: 'User registered successfully',
      data: { userAccount: toProfileAccount(userAccount) },
      tokens,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = await this.usersRepository.findByEmail(normalizedEmail);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Authentication failed');
    }

    const passwordMatches = await comparePassword(
      loginDto.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new UnauthorizedException('Authentication failed');
    }

    const tokens = await this.generateTokens(user);
    return {
      message: 'Login successful',
      data: { userAccount: toProfileAccount(user) },
      tokens,
    };
  }

  async logout(payload: RefreshTokenDto) {
    const refreshPayload = await this.verifyRefreshToken(payload.refreshToken);
    const stored = await this.authRepository.findRefreshTokenById(
      refreshPayload.tokenId,
    );

    if (!stored || stored.userId !== refreshPayload.sub) {
      return { message: 'Logout successful' };
    }

    if (stored.tokenHash !== hashValue(payload.refreshToken)) {
      await this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
      throw new UnauthorizedException('Refresh token invalid');
    }

    await this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
    return { message: 'Logout successful' };
  }

  async validateAccessToken(token: string): Promise<AccessTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenResponse>(
        token,
        {
          secret: this.configService.getOrThrow<string>('auth.accessSecret'),
        },
      );
      if (payload.type !== 'access') throw new UnauthorizedException();
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private async generateTokens(user: UserRecord): Promise<AuthTokens> {
    const tokenID = randomUUID();
    const roleNames = (user.roles || []).map((ur) => ur.role.name);

    const accessTokenPayload: AccessTokenResponse = {
      sub: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      roles: roleNames.length > 0 ? roleNames : ['user'],
      tokenID,
      type: 'access',
    };

    const refreshTokenPayload: RefreshTokenResponse = {
      sub: user.id,
      email: user.email,
      name: user.name,
      tokenId: tokenID,
      type: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.getOrThrow<string>('auth.accessSecret'),
        expiresIn:
          parseInt(this.configService.get('auth.accessExpiresIn', '15'), 10) *
          60,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
        expiresIn:
          parseInt(this.configService.get('auth.refreshExpiresIn', '7'), 10) *
          86400,
      }),
    ]);

    const expiresAt = await this.calculateExpirationDate(refreshToken);
    await this.revokeRefreshToken(user.id);
    await this.authRepository.saveRefreshToken(
      buildRefreshTokenSave(refreshToken, tokenID, user.id, expiresAt),
    );

    return { accessToken, refreshToken };
  }

  private async revokeRefreshToken(userID: string): Promise<void> {
    await this.authRepository.deleteRefreshTokenByUserId(userID);
  }

  private async calculateExpirationDate(token: string): Promise<string> {
    const payload = await this.jwtService.verifyAsync<{ exp?: number }>(token, {
      secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
    });
    return new Date((payload.exp || 0) * 1000).toISOString();
  }

  async refreshTokens(payload: RefreshTokenDto): Promise<AuthResponse> {
    const refreshPayload = await this.verifyRefreshToken(payload.refreshToken);
    const stored = await this.authRepository.findRefreshTokenById(
      refreshPayload.tokenId,
    );

    if (
      !stored ||
      stored.userId !== refreshPayload.sub ||
      stored.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.usersRepository.findById(refreshPayload.sub);
    if (!user || !user.isActive)
      throw new UnauthorizedException('User unavailable');

    await this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
    const tokens = await this.generateTokens(user);

    return {
      message: 'Token refreshed',
      data: { userAccount: toProfileAccount(user) },
      tokens,
    };
  }

  private async verifyRefreshToken(
    token: string,
  ): Promise<RefreshTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenResponse>(
        token,
        {
          secret: this.configService.getOrThrow<string>('auth.refreshSecret'),
        },
      );
      if (payload.type !== 'refresh') throw new UnauthorizedException();
      return payload;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new UnauthorizedException();
    return {
      message: 'User profile fetched',
      data: toProfileAccount(user),
    };
  }
}
