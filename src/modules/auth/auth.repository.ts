import { Injectable } from '@nestjs/common';

export interface refreshTokenRecord {
    userId: string;
    tokenId: string;
    tokenHash: string;
    expiresAt: string;
    createdAt: string;
}

export interface IAuthRepository {
    saveRefreshToken(token: Omit<refreshTokenRecord, 'createdAt'>): refreshTokenRecord;
    findRefreshToken(tokenId: string): refreshTokenRecord | null;
    deleteRefreshTokenByUserId(userId: string): void;
    findRefreshTokenById(tokenId: string): refreshTokenRecord | null;
    deleteRefreshToken(tokenId: string): void;
    deleteRefreshTokensByUserId(userId: string): void;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
    private readonly refreshTokens = new Map<string, refreshTokenRecord>();

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

    deleteRefreshTokenByUserId(userId: string): void {
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
