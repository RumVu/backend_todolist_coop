import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { RefreshToken } from '@prisma/client';

export type refreshTokenRecord = RefreshToken;

export interface IAuthRepository {
    saveRefreshToken(token: Omit<refreshTokenRecord, 'id' | 'createdAt'>): Promise<refreshTokenRecord>;
    findRefreshToken(tokenId: string): Promise<refreshTokenRecord | null>;
    deleteRefreshTokenByUserId(userId: string): Promise<void>;
    findRefreshTokenById(tokenId: string): Promise<refreshTokenRecord | null>;
    deleteRefreshToken(tokenId: string): Promise<void>;
    deleteRefreshTokensByUserId(userId: string): Promise<void>;
}

@Injectable()
export class AuthRepository implements IAuthRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveRefreshToken(
        token: Omit<refreshTokenRecord, "id" | "createdAt">
    ): Promise<refreshTokenRecord> {
        return this.prisma.refreshToken.create({
            data: token
        });
    }

    async findRefreshToken(tokenId: string): Promise<refreshTokenRecord | null> {
        return this.prisma.refreshToken.findFirst({
            where: { tokenId }
        });
    }

    async deleteRefreshTokenByUserId(userId: string): Promise<void> {
        await this.deleteRefreshTokensByUserId(userId);
    }

    async findRefreshTokenById(tokenId: string): Promise<refreshTokenRecord | null> {
        return this.prisma.refreshToken.findFirst({
            where: { tokenId }
        });
    }

    async deleteRefreshToken(tokenId: string): Promise<void> {
        try {
            // Prisma throws if not found during delete, so use deleteMany for safe deletion
            await this.prisma.refreshToken.deleteMany({
                where: { tokenId }
            });
        } catch {}
    }

    async deleteRefreshTokensByUserId(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }
}
