import { hashPassword } from '../src/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = 'adminadmin';
  const adminUsername = 'Admin';

  const hashedPassword = await hashPassword(adminPassword);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      username: adminUsername,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
