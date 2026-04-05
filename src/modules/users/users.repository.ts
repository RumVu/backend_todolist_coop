import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { User, Prisma } from '../../../prisma/generated-client';

export type UserRecord = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: { role: true };
    };
  };
}>;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async findByUsername(username: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { username: username.trim().toLowerCase() },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async findById(id: string): Promise<UserRecord | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<UserRecord> {
    return this.prisma.user.create({
      data,
      include: {
        roles: {
          include: { role: true },
        },
      },
    });
  }

  async update(
    id: string,
    updates: Prisma.UserUpdateInput,
  ): Promise<UserRecord | null> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: updates,
        include: {
          roles: {
            include: { role: true },
          },
        },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {
      // ignore
    }
  }

  async findAll(): Promise<UserRecord[]> {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: { role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
