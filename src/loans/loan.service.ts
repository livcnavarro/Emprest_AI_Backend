import {
  BadGatewayException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { throwLoanRequestError } from './loan-errors';

interface LoanRequestResult {
  outcome: string;
  loan_id: string | null;
  created_at: Date | null;
  due_date: Date | null;
}

function toDateOnly(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : value.slice(0, 10);
}

@Injectable()
export class LoanService {
  constructor(private readonly prisma: PrismaService) {}

  async listOpen(authUserId: string) {
    const loans = await this.prisma.withAuthenticatedUser(
      authUserId,
      (transaction) =>
        transaction.loan.findMany({
          where: { authUserId, returnedAt: null },
          select: {
            id: true,
            dueDate: true,
            equipment: {
              select: {
                patrimony: true,
                name: true,
              },
            },
          },
          orderBy: { dueDate: 'asc' },
        }),
    );

    return loans.map((loan) => ({
      id: loan.id,
      equipmentPatrimony: loan.equipment.patrimony,
      equipmentName: loan.equipment.name,
      dueDate: toDateOnly(loan.dueDate),
    }));
  }

  async request(authUserId: string, equipmentPatrimony: string) {
    const rows = await this.prisma.withAuthenticatedUser(
      authUserId,
      (transaction) =>
        transaction.$queryRaw<LoanRequestResult[]>(Prisma.sql`
          SELECT outcome, loan_id, created_at, due_date
          FROM public.request_loan(${equipmentPatrimony}::text)
        `),
    );
    const result = rows[0];

    if (!result) {
      throw new BadGatewayException(
        'O banco não retornou o resultado da solicitação.',
      );
    }
    if (result.outcome !== 'CREATED') {
      throwLoanRequestError(result.outcome);
    }
    if (!result.loan_id || !result.created_at || !result.due_date) {
      throw new BadGatewayException(
        'O banco retornou dados incompletos para o empréstimo criado.',
      );
    }

    return {
      id: result.loan_id,
      createdAt: result.created_at.toISOString(),
      dueDate: toDateOnly(result.due_date),
    };
  }
}
