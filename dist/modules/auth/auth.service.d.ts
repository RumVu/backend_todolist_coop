import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
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
        };
    };
    tokens: AuthTokens;
}
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
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
    type: "access";
}
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(authRepository: AuthRepository, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    logout(payload: RefreshTokenDto): Promise<{
        message: string;
        data: null;
    }>;
    validateAccessToken(token: string): Promise<AccessTokenResponse>;
    private generateTokens;
    private revokeRefreshToken;
    private calculateExpirationDate;
    private verifyRefreshToken;
    refreshTokens(payload: RefreshTokenDto): Promise<AuthResponse>;
    getCurrentUser(userId: string): {
        message: string;
        data: {
            roles?: string[] | undefined;
            isActive: boolean;
            createdAt: string;
            updatedAt: string;
            phoneNum?: string | undefined;
            id: string;
            name: string;
            username: string;
            email: string;
        };
    };
}
export {};
