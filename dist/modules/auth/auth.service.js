"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const auth_repository_1 = require("./auth.repository");
let AuthService = class AuthService {
    authRepository;
    jwtService;
    configService;
    constructor(authRepository, jwtService, configService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    hashPassword(password) {
        return (0, crypto_1.createHash)('sha256').update(password).digest('hex');
    }
    async register(registerDto) {
        const normalizedEmail = registerDto.email.trim().toLowerCase();
        const normalizedUsername = registerDto.name.trim().toLowerCase();
        if (!normalizedEmail) {
            throw new common_1.BadRequestException("Email must not be empty");
        }
        if (!normalizedUsername) {
            throw new common_1.BadRequestException("Username must not be empty");
        }
        const existingUserByEmail = this.authRepository.findByEmail(normalizedEmail);
        if (existingUserByEmail) {
            throw new common_1.BadRequestException(`Email ${normalizedEmail} is already in use,please change to another email!`);
        }
        const existingUserByUsername = this.authRepository.findByUsername(normalizedUsername);
        if (existingUserByUsername) {
            throw new common_1.BadRequestException(`Username ${normalizedUsername} is already in use,please change to another username!`);
        }
        const userAccount = this.authRepository.createAccount({
            id: (0, crypto_1.randomUUID)(),
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
    async generateTokens(user) {
        const tokenID = (0, crypto_1.randomUUID)();
        const accessTokenPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 15 * 60,
            tokenID,
            type: "access"
        };
        const refreshTokenPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
            tokenID,
            type: "refresh"
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(accessTokenPayload, {
                secret: this.configService.getOrThrow("auth.accessSecret"),
                expiresIn: parseInt(this.configService.get("auth.accessExpiresIn", "15") || "15", 10) * 60
            }),
            this.jwtService.signAsync(refreshTokenPayload, {
                secret: this.configService.getOrThrow("auth.refreshSecret"),
                expiresIn: parseInt(this.configService.get("auth.refreshExpiresIn", "7") || "7", 10) * 24 * 60 * 60
            })
        ]);
        return { accessToken, refreshToken };
    }
    async revokeRefreshToken(userID) {
        this.authRepository.deleteRefreshTokenByUserId(userID);
    }
    async calculateExpirationDate(token) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: this.configService.getOrThrow("auth.refreshSecret"),
            ignoreExpiration: false
        });
        if (!payload.exp) {
            throw new common_1.UnauthorizedException("Refresh token expiration is missing");
        }
        return new Date(payload.exp * 1000).toISOString();
    }
    hashValue(value) {
        return (0, crypto_1.createHash)("sha256").update(value).digest("hex");
    }
    toProfileAccount(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createAt: user.createdAt,
            updateAt: user.updatedAt
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map