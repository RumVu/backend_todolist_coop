import 'dotenv/config';
import { Server } from 'http';
import { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { configureApp } from '../../src/app.setup';
import { hashPassword } from '../../src/common/utils/hash.util';
import { PrismaService } from '../../src/common/prisma/prisma.service';

process.env.NODE_ENV = 'test';

export const prisma = new PrismaService();

export async function createE2EApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  configureApp(app);
  await app.init();
  return app;
}

export function getHttpServer(app: INestApplication) {
  return app.getHttpServer() as Server;
}

export async function ensureBaseData() {
  await prisma.$connect();

  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      description: 'Default user role',
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Administrator role',
    },
  });

  const adminPasswordHash = await hashPassword('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@ex.com' },
    update: {
      passwordHash: adminPasswordHash,
      isActive: true,
    },
    create: {
      email: 'admin@ex.com',
      username: 'admin',
      name: 'Super Admin',
      passwordHash: adminPasswordHash,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });
}

export async function cleanupUsersByEmail(emails: string[]) {
  if (emails.length === 0) {
    return;
  }

  await prisma.user.deleteMany({
    where: {
      email: { in: emails },
    },
  });
}

export function uniqueId(prefix = 'e2e') {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}${suffix}`;
}

export function uniqueEmail(prefix = 'e2e') {
  const normalizedPrefix = prefix.replace(/[^a-z0-9]/gi, '').toLowerCase();
  const localPart = `${normalizedPrefix.slice(0, 8)}${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  return `${localPart}@ex.com`;
}

export async function closeE2EPrisma() {
  await prisma.$disconnect();
}
