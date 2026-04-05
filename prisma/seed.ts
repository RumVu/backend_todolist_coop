import { PrismaClient } from './generated-client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

async function main() {
  console.log('Seeding database...');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not defined');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Create Permissions
    const permissions = [
      { name: 'users:read', description: 'View all users' },
      { name: 'users:write', description: 'Manage users' },
      { name: 'tasks:read', description: 'View all tasks' },
      { name: 'tasks:write', description: 'Manage tasks' },
      { name: 'settings:manage', description: 'Manage system settings' },
      { name: 'reports:view', description: 'View system reports' },
    ];

    for (const perm of permissions) {
      await prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      });
    }

    // 2. Create Roles
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'System Administrator',
      },
    });

    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: {
        name: 'user',
        description: 'Standard User',
      },
    });

    // 3. Link Permissions to Roles
    const allPerms = await prisma.permission.findMany();
    for (const perm of allPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      });
    }

    // User role gets basic perms
    const userPerms = allPerms.filter((p) =>
      ['tasks:read', 'tasks:write'].includes(p.name),
    );
    for (const perm of userPerms) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: perm.id,
        },
      });
    }

    // 4. Create Initial Admin User
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@ex.com',
        name: 'Super Admin',
        passwordHash: adminPasswordHash,
        isActive: true,
      },
    });

    // Link Admin User to Admin Role
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

    // 5. Create System Settings
    const settings = [
      { key: 'ALLOW_REGISTRATION', value: 'true', description: 'Allow new users to register' },
      { key: 'MAINTENANCE_MODE', value: 'false', description: 'Toggle system maintenance mode' },
      { key: 'MAX_FILE_SIZE_MB', value: '5', description: 'Maximum upload file size' },
    ];

    for (const setting of settings) {
      await prisma.systemSetting.upsert({
        where: { key: setting.key },
        update: {},
        create: setting,
      });
    }

    console.log('Seeding completed successfully.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
