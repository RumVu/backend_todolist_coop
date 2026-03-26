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
const auth_mapper_1 = require("./auth.mapper");
const hash_util_1 = require("../../common/utils/hash.util");
let AuthService = class AuthService {
    authRepository;
    jwtService;
    configService;
    constructor(authRepository, jwtService, configService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const normalizedEmail = registerDto.email.trim().toLowerCase();
        const normalizedUsername = registerDto.username.trim().toLowerCase();
        const normalizedName = registerDto.name.trim();
        if (!normalizedEmail) {
            throw new common_1.BadRequestException("Email must not be empty");
        }
        if (!normalizedUsername) {
            throw new common_1.BadRequestException("Username must not be empty");
        }
        if (!normalizedName) {
            throw new common_1.BadRequestException("Name must not be empty");
        }
        const existingUserByEmail = this.authRepository.findByEmail(normalizedEmail);
        if (existingUserByEmail) {
            throw new common_1.BadRequestException(`Email ${normalizedEmail} is already in use,please change to another email!`);
        }
        const existingUserByUsername = this.authRepository.findByUsername(normalizedUsername);
        if (existingUserByUsername) {
            throw new common_1.BadRequestException(`Username ${normalizedUsername} is already in use,please change to another username!`);
        }
        if (registerDto.password !== registerDto.confirmPassword) {
            throw new common_1.BadRequestException('Password confirmation does not match');
        }
        const rounds = parseInt(this.configService.get('auth.bcryptSaltRounds', '10') || '10', 10);
        const userAccount = this.authRepository.createAccount({
            id: (0, crypto_1.randomUUID)(),
            email: normalizedEmail,
            name: normalizedName,
            username: normalizedUsername,
            phoneNum: registerDto.phoneNum,
            isActive: true,
            passwordHash: await (0, hash_util_1.hashPassword)(registerDto.password, rounds),
        });
        const tokens = await this.generateTokens(userAccount);
        return {
            message: "User registered successfully",
            data: {
                userAccount: (0, auth_mapper_1.toProfileAccount)(userAccount),
            },
            tokens
        };
    }
    async login(loginDto) {
        const normalizedEmail = loginDto.email.trim().toLowerCase();
        const user = this.authRepository.findByEmail(normalizedEmail);
        if (!user) {
            throw new common_1.UnauthorizedException('Email or password is incorrect');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        const passwordMatches = await (0, hash_util_1.comparePassword)(loginDto.password, user.passwordHash);
        if (!passwordMatches) {
            throw new common_1.UnauthorizedException('Email or password is incorrect');
        }
        const tokens = await this.generateTokens(user);
        return {
            message: 'Login successfully',
            data: {
                userAccount: (0, auth_mapper_1.toProfileAccount)(user),
            },
            tokens,
        };
    }
    async logout(payload) {
        const refreshPayload = await this.verifyRefreshToken(payload.refreshToken);
        const storedRefreshToken = this.authRepository.findRefreshTokenById(refreshPayload.tokenId);
        if (!storedRefreshToken) {
            return {
                message: "Logout successfully",
                data: null
            };
        }
        if (storedRefreshToken.tokenHash !== (0, hash_util_1.hashValue)(payload.refreshToken)) {
            this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
            throw new common_1.UnauthorizedException("Refresh token is invalid");
        }
        this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
        return {
            message: "Logout successfully",
            data: null
        };
    }
    async validateAccessToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow("auth.accessSecret")
            });
            if (payload.type !== "access") {
                throw new common_1.UnauthorizedException("Access token type is invalid");
            }
            return payload;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException("Invalid or expired access token");
        }
    }
    async generateTokens(user) {
        const tokenID = (0, crypto_1.randomUUID)();
        const accessTokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            roles: user.roles ?? ['user'],
            tokenID,
            type: "access"
        };
        const refreshTokenPayload = {
            sub: user.id,
            email: user.email,
            name: user.name,
            tokenId: tokenID,
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
        const expiresAt = await this.calculateExpirationDate(refreshToken);
        await this.revokeRefreshToken(user.id);
        this.authRepository.saveRefreshToken((0, auth_mapper_1.buildRefreshTokenSave)(refreshToken, tokenID, user.id, expiresAt));
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
    async verifyRefreshToken(token) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow("auth.refreshSecret")
            });
            if (payload.type !== "refresh") {
                throw new common_1.UnauthorizedException("Refresh token type is invalid");
            }
            if (!payload.tokenId) {
                throw new common_1.UnauthorizedException("Refresh token id is missing");
            }
            return payload;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException("Invalid or expired refresh token");
        }
    }
    async refreshTokens(payload) {
        const refreshPayload = await this.verifyRefreshToken(payload.refreshToken);
        const storedRefreshToken = this.authRepository.findRefreshTokenById(refreshPayload.tokenId);
        if (!storedRefreshToken) {
            throw new common_1.UnauthorizedException("Refresh token is not recognized");
        }
        if (storedRefreshToken.userId !== refreshPayload.sub) {
            throw new common_1.UnauthorizedException("Refresh token user mismatch");
        }
        if (storedRefreshToken.expiresAt <= new Date().toISOString()) {
            this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
            throw new common_1.UnauthorizedException("Refresh token has expired");
        }
        if (storedRefreshToken.tokenHash !== (0, hash_util_1.hashValue)(payload.refreshToken)) {
            this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
            throw new common_1.UnauthorizedException("Refresh token is invalid");
        }
        const user = this.authRepository.findById(refreshPayload.sub);
        if (!user) {
            this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
            throw new common_1.UnauthorizedException("User not found");
        }
        if (!user.isActive) {
            this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
            throw new common_1.UnauthorizedException("User account is inactive");
        }
        this.authRepository.deleteRefreshToken(refreshPayload.tokenId);
        const tokens = await this.generateTokens(user);
        return {
            message: "Refresh token successfully",
            data: {
                userAccount: (0, auth_mapper_1.toProfileAccount)(user)
            },
            tokens
        };
    }
    getCurrentUser(userId) {
        const user = this.authRepository.findById(userId);
        if (!user) {
            throw new common_1.UnauthorizedException("User not found");
        }
        return {
            message: "Current user fetched successfully",
            data: (0, auth_mapper_1.toProfileAccount)(user)
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