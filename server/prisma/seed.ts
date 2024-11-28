import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const testPass = await bcrypt.hash('test', 10);
  // Create Users
  await prisma.user.create({
    data: {
      email: 'approver@example.com',
      password: testPass,
      name: 'Approver User',
      role: 'APPROVER',
    },
  });

  const seller = await prisma.user.create({
    data: {
      email: 'seller@example.com',
      password: testPass,
      name: 'Seller User',
      role: 'SELLER',
    },
  });

  await prisma.user.create({
    data: {
      email: 'buyer@example.com',
      password: testPass,
      name: 'Buyer User',
      role: 'BUYER',
    },
  });

  // Create Listing
  await prisma.listing.createMany({
    data: [
      {
        title: 'Sample Product 1',
        description: 'A wonderful product 1',
        price: 59.99,
        sellerId: seller.id,
      },
      {
        title: 'Sample Product 2',
        description: 'A wonderful product 2',
        price: 45.99,
        sellerId: seller.id,
      },
      {
        title: 'Sample Product 3',
        description: 'A wonderful product 3',
        price: 32.99,
        sellerId: seller.id,
      },
    ],
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
