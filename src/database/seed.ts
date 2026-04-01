import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@todolist.com' },
    update: {},
    create: {
      email: 'admin@todolist.com',
      username: 'superadmin',
      name: 'Super Admin',
      passwordHash: adminPassword,
      roles: ['admin', 'editor', 'viewer'],
      isActive: true,
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
