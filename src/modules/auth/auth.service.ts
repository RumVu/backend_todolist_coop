import { createHash, randomUUID } from "crypto";
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
import { AuthRepository, AuthUserRecord } from "./auth.repository";

// AuthResponse is the structure of the response returned by the authentication service,
// which includes a message, user data, and authentication tokens.
interface AuthResponse {
  message: string;
  data: {
    userAccount: {
      id: string;
      email: string;
      name: string;
      phoneNum?: string;
      isActive: boolean;
      createAt: string;
      updateAt: string;
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
  iat: number;
  exp: number;
  tokenID: string;
  type: "refresh";
}
// AccessTokenPayload is the payload structure for the access token,
//  which includes user information and token metadata.
interface AccessTokenPayload {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  tokenID: string;
  type: "access";
}

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) { }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
  // The register method handles user registration by validating the input, 
  // checking for existing users, creating a new user record, 
  // and generating authentication tokens.
  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const normalizedEmail = registerDto.email.trim().toLowerCase();
    const normalizedUsername = registerDto.name.trim().toLowerCase();


    if (!normalizedEmail) {
      throw new BadRequestException
        ("Email must not be empty");
    }
    if (!normalizedUsername) {
      throw new BadRequestException
        ("Username must not be empty");
    }

    const existingUserByEmail = this.authRepository.findByEmail(normalizedEmail);
    if (existingUserByEmail) {
      throw new BadRequestException
        (`Email ${normalizedEmail} is already in use,please change to another email!`);
    }
    const existingUserByUsername = this.authRepository.findByUsername(normalizedUsername);
    if (existingUserByUsername) {
      throw new BadRequestException
        (`Username ${normalizedUsername} is already in use,please change to another username!`);
    }

    const userAccount = this.authRepository.createAccount({
      id: randomUUID(),
      email: normalizedEmail,
      name: normalizedUsername,
      phoneNum: registerDto.phoneNum,
      isActive: true,
      passwordHash: this.hashPassword(registerDto.password),
      passwordSalt: ""
    });
    const tokens = await this.generateTokens(userAccount);
    return {
      message: "User registered successfully",
      data: {
        userAccount: this.toProfileAccount(userAccount),
      },
      tokens
    };
  }
  private async generateTokens(user: AuthUserRecord): Promise<AuthTokens> {
    const tokenID = randomUUID();
    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // Access token valid for 15 minutes
      tokenID,
      type: "access"
    };
    const refreshTokenPayload: RefreshTokenResponse = {
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // Refresh token valid for 7 days
      tokenID,
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
    return { accessToken, refreshToken };
  }
  // The revokeRefreshToken method is responsible for i
  // nvalidating the current refresh token by deleting it 
  // from the repository based on the user ID.
  private async revokeRefreshToken(userID:string): Promise<void> {
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

  private hashValue(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }

  private toProfileAccount(user: AuthUserRecord) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createAt: user.createdAt,
      updateAt: user.updatedAt
    };
  }


}
