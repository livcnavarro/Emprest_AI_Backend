import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  withAuthenticatedUser<T>(
    authUserId: string,
    operation: (transaction: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(
      async (transaction) => {
        await transaction.$executeRawUnsafe('SET LOCAL ROLE authenticated');
        await transaction.$queryRaw`
          SELECT set_config('request.jwt.claim.sub', ${authUserId}, true)
        `;
        await transaction.$queryRaw`
          SELECT set_config('request.jwt.claim.role', 'authenticated', true)
        `;
        await transaction.$queryRaw`
          SELECT set_config(
            'request.jwt.claims',
            ${JSON.stringify({ sub: authUserId, role: 'authenticated' })},
            true
          )
        `;

        return operation(transaction);
      },
      { maxWait: 5000, timeout: 10000 },
    );
  }
}
