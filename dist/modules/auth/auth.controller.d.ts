import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./auth.service").AuthResponse>;
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<import("./auth.service").AuthResponse>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        message: string;
        data: null;
    }>;
    me(userId: string): {
        message: string;
        data: {
            id: string;
            name: string;
            username: string;
            email: string;
            isActive: boolean;
            createAt: string;
            updateAt: string;
        };
    };
}
