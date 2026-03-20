import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
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
        };
    };
    tokens: AuthTokens;
}
interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(authRepository: AuthRepository, jwtService: JwtService, configService: ConfigService);
    private hashPassword;
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    private generateTokens;
    private revokeRefreshToken;
    private calculateExpirationDate;
    private hashValue;
    private toProfileAccount;
}
export {};
