import { randomUUID } from "crypto";
import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
import type { IAuthRepository } from "./auth.repository";
import { UsersRepository, UserRecord } from "../users/users.repository";
import { buildRefreshTokenSave, toProfileAccount } from './auth.mapper';
import { hashPassword, comparePassword, hashValue } from '../../common/utils/hash.util';

// AuthResponse is the structure of the response returned by the authentication service,
// which includes a message, user data, and authentication tokens.
export interface AuthResponse {
  message: string;
  data: {
    userAccount: {
      id: string;
      email: string;
      name: string;
      phoneNum?: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    }
  }
  tokens: AuthTokens;
}

// AuthTokens is the structure for both access 
// and refresh tokens returned upon successful authentication.

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
// RefreshTokenResponse is the payload structure for the refresh token,
//  which includes user information and token metadata.
interface RefreshTokenResponse {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
  tokenId: string;
  type: "refresh";
}
// AccessTokenPayload is the payload structure for the access token,
//  which includes user information and token metadata.
interface AccessTokenResponse {
  sub: string;
  email: string;
  username: string;
  name: string;
  roles?: string[];
  iat?: number;
  exp?: number;
  tokenID: string;
  type: "access";
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  // Password and token hashing delegated to shared utils (bcrypt for passwords,
  // sha256 for token hashing)
  // The register method handles user registration by validating the input, 
  // checking for existing users, creating a new user record, 
  // and generating authentication tokens.
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    const normalizedUsername = registerDto.username.trim().toLowerCase();
    const normalizedName = registerDto.name.trim();


    if (!normalizedEmail) {
      throw new BadRequestException
        ("Email must not be empty");
    }
    if (!normalizedUsername) {
      throw new BadRequestException
        ("Username must not be empty");
    }
    if (!normalizedName) {
      throw new BadRequestException
        ("Name must not be empty");
    }
    const existingUserByEmail = this.usersRepository.findByEmail(normalizedEmail);
    if (existingUserByEmail) {
      throw new BadRequestException
        (`Email ${normalizedEmail} is already in use,please change to another email!`);
    }
    const existingUserByUsername = this.usersRepository.findByUsername(normalizedUsername);
    if (existingUserByUsername) {
      throw new BadRequestException
        (`Username ${normalizedUsername} is already in use,please change to another username!`);
    }
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new BadRequestException('Password confirmation does not match');
    }
    const rounds = parseInt(this.configService.get<string>('auth.bcryptSaltRounds', '10') || '10', 10);
    const userAccount = this.usersRepository.create({
      id: randomUUID(),
      email: normalizedEmail,
      name: normalizedName,
      username: normalizedUsername,
      phoneNum: registerDto.phoneNum,
      isActive: true,
      roles: ['user'],
      passwordHash: await hashPassword(registerDto.password, rounds),
    });

    const tokens = await this.generateTokens(userAccount);
    return {
      message: "User registered successfully",
      data: {
        userAccount: toProfileAccount(userAccount),
      },
      tokens
    };

  }
  // The login method authenticates a user by validating the provided credentials, 
  // generating authentication tokens, and returning the user profile along with the tokens.
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const normalizedEmail = loginDto.email.trim().toLowerCase();
    const user = this.usersRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const passwordMatches = await comparePassword(loginDto.password, user.passwordHash || '');

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const tokens = await this.generateTokens(user);

    return {
      message: 'Login successfully',
      data: {
        userAccount: toProfileAccount(user),
      },
      tokens,
    };
  }


  async logout(payload: RefreshTokenDto) {
    const refreshPayload = await this.verifyRefreshToken(payload.refreshToken);
    const storedRefreshToken = this.authRepository.findRefreshTokenById(refreshPayload.tokenId);

    if (!storedRefreshToken) {
      return {
        message: "Logout successfully",
        data: null
      };
    }

    if (storedRefreshToken.tokenHash !== hashValue(payload.refreshToken)) {
      this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
      throw new UnauthorizedException("Refresh token is invalid");
    }

    this.authRepository.deleteRefreshToken(refreshPayload.tokenId);

    return {
      message: "Logout successfully",
      data: null
    };
  }

  async validateAccessToken(token: string): Promise<AccessTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<AccessTokenResponse>(token, {
        secret: this.configService.getOrThrow<string>("auth.accessSecret")
      });
      if (payload.type !== "access") {
        throw new UnauthorizedException("Access token type is invalid");
      }
      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired access token");
    }
  }

  private async generateTokens(user: UserRecord): Promise<AuthTokens> {
    const tokenID = randomUUID();
    const accessTokenPayload: AccessTokenResponse = {
      sub: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      roles: user.roles ?? ['user'],
      tokenID,
      type: "access"
    };
    const refreshTokenPayload: RefreshTokenResponse = {
      sub: user.id,
      email: user.email,
      name: user.name,
      tokenId: tokenID,
      type: "refresh"
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.getOrThrow<string>("auth.accessSecret"),
        expiresIn: parseInt(this.configService.get<string>("auth.accessExpiresIn", "15") || "15", 10) * 60
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.getOrThrow<string>("auth.refreshSecret"),
        expiresIn: parseInt(this.configService.get<string>("auth.refreshExpiresIn", "7") || "7", 10) * 24 * 60 * 60
      })
    ]);
    // Persist the refresh token (store hashed token + expiresAt)
    const expiresAt = await this.calculateExpirationDate(refreshToken);
    // Revoke existing refresh tokens for this user (single active token policy)
    await this.revokeRefreshToken(user.id);
    this.authRepository.saveRefreshToken(buildRefreshTokenSave(refreshToken, tokenID, user.id, expiresAt));

    return { accessToken, refreshToken };
  }
  // The revokeRefreshToken method is responsible for i
  // nvalidating the current refresh token by deleting it 
  // from the repository based on the user ID.
  private async revokeRefreshToken(userID: string): Promise<void> {
    this.authRepository.deleteRefreshTokenByUserId(userID);
  }
  // The calculateExpirationDate method decodes the refresh token 
  // to extract the expiration time (exp) and converts it to an ISO string format. 
  // If the exp field is missing, it throws an UnauthorizedException.
  private async calculateExpirationDate(token: string): Promise<string> {
    const payload = await this.jwtService.verifyAsync<{ exp?: number }>(token, {
        secret: this.configService.getOrThrow<string>("auth.refreshSecret"),
        ignoreExpiration: false
    });

    if (!payload.exp) {
      throw new UnauthorizedException("Refresh token expiration is missing");
    }

    return new Date(payload.exp * 1000).toISOString();
  }
  private async verifyRefreshToken(token: string): Promise<RefreshTokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<RefreshTokenResponse>(token, {
        secret: this.configService.getOrThrow<string>("auth.refreshSecret")
      });
      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Refresh token type is invalid");
      }

      if (!payload.tokenId) {
        throw new UnauthorizedException("Refresh token id is missing");
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Invalid or expired refresh token");
    }
  }
  async refreshTokens(payload: RefreshTokenDto): Promise<AuthResponse> {
    const refreshPayload = await this.verifyRefreshToken(payload.refreshToken);
    const storedRefreshToken = this.authRepository.findRefreshTokenById(refreshPayload.tokenId);

    if (!storedRefreshToken) {
      throw new UnauthorizedException("Refresh token is not recognized");
    }

    if (storedRefreshToken.userId !== refreshPayload.sub) {
      throw new UnauthorizedException("Refresh token user mismatch");
    }

    if (storedRefreshToken.expiresAt <= new Date().toISOString()) {
      this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
      throw new UnauthorizedException("Refresh token has expired");
    }

    if (storedRefreshToken.tokenHash !== hashValue(payload.refreshToken)) {
      this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
      throw new UnauthorizedException("Refresh token is invalid");
    }

    const user = this.usersRepository.findById(refreshPayload.sub);

    if (!user) {
      this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
      throw new UnauthorizedException("User not found");
    }

    if (!user.isActive) {
      this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
      throw new UnauthorizedException("User account is inactive");
    }

    this.authRepository.deleteRefreshToken(refreshPayload.tokenId);

    const tokens = await this.generateTokens(user);

    return {
      message: "Refresh token successfully",
      data: {
        userAccount: toProfileAccount(user)
      },
      tokens
    };
  }

  getCurrentUser(userId: string) {
    const user = this.usersRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return {
      message: "Current user fetched successfully",
      data: toProfileAccount(user)
    };
  }

}
