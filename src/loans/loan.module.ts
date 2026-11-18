import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { SupabaseModule } from '../supabase/supabase.module';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  imports: [SupabaseModule],
  controllers: [LoanController],
  providers: [LoanService, SupabaseAuthGuard],
})
export class LoanModule {}
