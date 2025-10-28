import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.$transaction(async (tx) => {
    console.log('📝 Checking/creating roles...');

    let adminRole = await tx.role.findFirst({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      adminRole = await tx.role.create({
        data: {
          name: 'admin',
        },
      });
      console.log('✅ Admin role created');
    } else {
      console.log('ℹ️ Admin role already exists');
    }

    let gestorRole = await tx.role.findFirst({
      where: { name: 'gestor' },
    });

    if (!gestorRole) {
      gestorRole = await tx.role.create({
        data: {
          name: 'gestor',
        },
      });
      console.log('✅ Gestor role created');
    } else {
      console.log('ℹ️ Gestor role already exists');
    }

    console.log('👤 Checking/creating default admin user...');

    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!adminPassword) {
      throw new Error(
        'ADMIN_DEFAULT_PASSWORD environment variable is required'
      );
    }

    const existingAdmin = await tx.user.findUnique({
      where: { email: 'admin@admin.com' },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = await tx.user.create({
        data: {
          name: 'Administrador',
          email: 'admin@admin.com',
          passwordHash: hashedPassword,
          roleId: adminRole.id,
        },
      });

      console.log('✅ Default admin user created:', {
        name: adminUser.name,
        email: adminUser.email,
        role: adminRole.name,
      });
    } else {
      console.log('ℹ️ Default admin user already exists:', {
        name: existingAdmin.name,
        email: existingAdmin.email,
      });
    }
  });

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
