import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthenticatedRequest } from '../auth/authenticated-request';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { LoanService } from './loan.service';

const requestLoanSchema = z.object({
  equipmentPatrimony: z.string().trim().min(1).max(64),
});

@Controller('api/loans')
@UseGuards(SupabaseAuthGuard)
export class LoanController {
  constructor(private readonly loans: LoanService) {}

  @Get()
  listOpen(@Req() request: AuthenticatedRequest) {
    return this.loans.listOpen(request.authUserId);
  }

  @Post()
  request(
    @Req() request: AuthenticatedRequest,
    @Body() body: unknown,
  ) {
    const parsed = requestLoanSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(
        'Informe um patrimônio de equipamento válido.',
      );
    }

    return this.loans.request(
      request.authUserId,
      parsed.data.equipmentPatrimony,
    );
  }
}
