import { Injectable } from '@nestjs/common';
import { Auth } from './entities/auth-session.entity';

export interface AuthUserRecord {
    id: string;
    name: string;
    email: string;
    phoneNum?: string;
    passwordHash: string;
    passwordSalt: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export interface refreshTokenRecord {
    userId: string;
    tokenId: string;
    expiresAt: string;
    createAt: string;
}

@Injectable()
export class AuthRepository {
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
            if (user.name === normalizedUsername) {
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
    saveRefreshToken(tokenRecord: refreshTokenRecord): void {
        this.refreshTokens.set(tokenRecord.tokenId, tokenRecord);
    }

    // In a real implementation, this would delete the refresh token from the database or in-memory store.
    // Since this is an in-memory repository, we can simply log the action or implement a token store if needed.
    deleteRefreshTokenByUserId(userId: string): void {
        console.log(`Revoking refresh tokens for user ID: ${userId}`);
    }



}
