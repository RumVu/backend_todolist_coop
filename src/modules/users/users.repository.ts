import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User } from '@prisma/client';

export type UserRecord = User;

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findByEmail(email: string): Promise<UserRecord | null> {
        return this.prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
    }

    async findByUsername(username: string): Promise<UserRecord | null> {
        return this.prisma.user.findUnique({ where: { username: username.trim().toLowerCase() } });
    }

    async findByName(name: string): Promise<UserRecord | null> {
        return this.prisma.user.findFirst({
            where: { name: { equals: name.trim(), mode: 'insensitive' } }
        });
    }

    async findByPhoneNum(phoneNum: string): Promise<UserRecord | null> {
        return this.prisma.user.findFirst({ where: { phoneNum: phoneNum.trim() } });
    }

    async findById(id: string): Promise<UserRecord | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async create(data: Omit<UserRecord, 'createdAt' | 'updatedAt' | 'id'> & { id?: string }): Promise<UserRecord> {
        return this.prisma.user.create({ data });
    }

    async update(id: string, updates: Partial<Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>>): Promise<UserRecord | null> {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: updates,
            });
        } catch {
            return null; // Trả về null nếu không tìm thấy User để update (giống logic cũ)
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({ where: { id } });
        } catch {}
    }

    async findAll(): Promise<UserRecord[]> {
        return this.prisma.user.findMany();
    }
}
