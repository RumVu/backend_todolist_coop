import { Injectable } from '@nestjs/common';
import { Auth } from './entities/auth-session.entity';

export interface AuthUserRecord {
    id: string;
    name: string;
    username: string;
    email: string;
    phoneNum?: string;
    passwordHash: string;
    createdAt: string;
    updatedAt: string;
    roles?: string[];
    isActive: boolean;
}

export interface refreshTokenRecord {
    userId: string;
    tokenId: string;
    tokenHash: string;
    expiresAt: string;
    createdAt: string;
}

export interface IAuthRepository {
    findByEmail(email: string): AuthUserRecord | null;
    findByUsername(username: string): AuthUserRecord | null;
    findByName(name: string): AuthUserRecord | null;
    findByPhoneNum(phoneNum: string): AuthUserRecord | null;
    findById(id: string): AuthUserRecord | null;
    createAccount(user: Omit<AuthUserRecord, 'createdAt' | 'updatedAt'>): AuthUserRecord;
    updateUserAccount(userId: string, updates: Partial<Omit<AuthUserRecord, 'id' | 'createdAt'>>): AuthUserRecord | null;
    saveRefreshToken(token: Omit<refreshTokenRecord, 'createdAt'>): refreshTokenRecord;
    findRefreshToken(tokenId: string): refreshTokenRecord | null;
    deleteRefreshTokenByUserId(userId: string): void;
    findRefreshTokenById(tokenId: string): refreshTokenRecord | null;
    deleteRefreshToken(tokenId: string): void;
    deleteRefreshTokensByUserId(userId: string): void;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
    private readonly users = new Map<string, AuthUserRecord>();
    private readonly refreshTokens = new Map<string, refreshTokenRecord>();

    findByEmail(email: string): AuthUserRecord | null {
        const normalizedEmail = email.trim().toLowerCase();

        for (const user of this.users.values()) {
            if (user.email === normalizedEmail) {
                return user;
            }
        }
        return null;
    }

    findByUsername(username: string): AuthUserRecord | null {
        const normalizedUsername = username.trim().toLowerCase();

        for (const user of this.users.values()) {
            if (user.username === normalizedUsername) {
                return user;
            }
        }
        return null;
    }

    findByName(name: string): AuthUserRecord | null {
        const normalizedName = name.trim().toLowerCase();

        for (const user of this.users.values()) {
            if (user.name === normalizedName) {
                return user;
            }
        }
        return null;
    }

    findByPhoneNum(phoneNum: string): AuthUserRecord | null {
        const normalizedPhoneNum = phoneNum.trim();

        for (const user of this.users.values()) {
            if (user.phoneNum === normalizedPhoneNum) {
                return user;
            }
        }
        return null;
    }
    findById(id: string): AuthUserRecord | null {
        return this.users.get(id) || null;
    }

    createAccount(
        user: Omit<AuthUserRecord, 'createdAt' | 'updatedAt'>,
    ): AuthUserRecord {
        const now = new Date().toISOString();
        const record: AuthUserRecord = {
            ...user,
            createdAt: now,
            updatedAt: now,
        };

        this.users.set(record.id, record);

        return record;
    }

    updateUserAccount(userId: string, updates: Partial<Omit<AuthUserRecord, 'id' | 'createdAt'>>): AuthUserRecord | null {
        const existingUser = this.users.get(userId);
        if (!existingUser) {
            return null;
        }

        const updatedUser: AuthUserRecord = {
            ...existingUser,
            ...updates,
            updatedAt: new Date().toISOString(),
        };

        this.users.set(userId, updatedUser);
        return updatedUser;
    }
    //---------------------------------token----------------------------
    saveRefreshToken(
        token: Omit<refreshTokenRecord, "createdAt">
    ): refreshTokenRecord {
        const record: refreshTokenRecord = {
            ...token,
            createdAt: new Date().toISOString()
        };

        this.refreshTokens.set(record.tokenId, record);

        return record;
    }
    findRefreshToken(tokenId: string): refreshTokenRecord | null {
        return this.refreshTokens.get(tokenId) || null;
    }
    // In a real implementation, this would delete the refresh token from the database or in-memory store.
    // Since this is an in-memory repository, we can simply log the action or implement a token store if needed.
    deleteRefreshTokenByUserId(userId: string): void {
        // Actually remove any refresh tokens associated with the user
        this.deleteRefreshTokensByUserId(userId);
    }
    findRefreshTokenById(tokenId: string): refreshTokenRecord | null {
        return this.refreshTokens.get(tokenId) ?? null;
    }

    deleteRefreshToken(tokenId: string): void {
        this.refreshTokens.delete(tokenId);
    }

    deleteRefreshTokensByUserId(userId: string): void {
        for (const [tokenId, token] of this.refreshTokens.entries()) {
            if (token.userId === userId) {
                this.refreshTokens.delete(tokenId);
            }
        }
    }



}
