"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
let AuthRepository = class AuthRepository {
    users = new Map();
    refreshTokens = new Map();
    findByEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();
        for (const user of this.users.values()) {
            if (user.email === normalizedEmail) {
                return user;
            }
        }
        return null;
    }
    findByUsername(username) {
        const normalizedUsername = username.trim().toLowerCase();
        for (const user of this.users.values()) {
            if (user.username === normalizedUsername) {
                return user;
            }
        }
        return null;
    }
    findByName(name) {
        const normalizedName = name.trim().toLowerCase();
        for (const user of this.users.values()) {
            if (user.name === normalizedName) {
                return user;
            }
        }
        return null;
    }
    findByPhoneNum(phoneNum) {
        const normalizedPhoneNum = phoneNum.trim();
        for (const user of this.users.values()) {
            if (user.phoneNum === normalizedPhoneNum) {
                return user;
            }
        }
        return null;
    }
    findById(id) {
        return this.users.get(id) || null;
    }
    createAccount(user) {
        const now = new Date().toISOString();
        const record = {
            ...user,
            createdAt: now,
            updatedAt: now,
        };
        this.users.set(record.id, record);
        return record;
    }
    updateUserAccount(userId, updates) {
        const existingUser = this.users.get(userId);
        if (!existingUser) {
            return null;
        }
        const updatedUser = {
            ...existingUser,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        this.users.set(userId, updatedUser);
        return updatedUser;
    }
    saveRefreshToken(token) {
        const record = {
            ...token,
            createdAt: new Date().toISOString()
        };
        this.refreshTokens.set(record.tokenId, record);
        return record;
    }
    findRefreshToken(tokenId) {
        return this.refreshTokens.get(tokenId) || null;
    }
    deleteRefreshTokenByUserId(userId) {
        this.deleteRefreshTokensByUserId(userId);
    }
    findRefreshTokenById(tokenId) {
        return this.refreshTokens.get(tokenId) ?? null;
    }
    deleteRefreshToken(tokenId) {
        this.refreshTokens.delete(tokenId);
    }
    deleteRefreshTokensByUserId(userId) {
        for (const [tokenId, token] of this.refreshTokens.entries()) {
            if (token.userId === userId) {
                this.refreshTokens.delete(tokenId);
            }
        }
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)()
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map