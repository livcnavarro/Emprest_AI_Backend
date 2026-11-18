import { Prisma, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { SeedClient, syncInitialData } from './seed-data';

function asSeedClient(transaction: Prisma.TransactionClient): SeedClient {
  return {
    equipment: {
      findMany: (args) => transaction.equipment.findMany(args),
      create: (args) => transaction.equipment.create(args),
    },
    profile: {
      findUnique: (args) => transaction.profile.findUnique(args),
      create: (args) => transaction.profile.create(args),
    },
  };
}

async function main(): Promise<void> {
  if (process.argv.length !== 3) {
    throw new Error('Uso: npm run db:seed -- <uuid-auth>');
  }

  const authUserId = z.string().uuid().parse(process.argv[2]);
  const prisma = new PrismaClient();

  try {
    await prisma.$transaction((transaction) =>
      syncInitialData(asSeedClient(transaction), authUserId),
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main();
