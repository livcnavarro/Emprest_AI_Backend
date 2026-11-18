import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseConfigService } from './supabase-config.service';

@Module({
  providers: [
    SupabaseConfigService,
    SupabaseAuthService,
    SupabaseAuthGuard,
  ],
  exports: [SupabaseAuthGuard, SupabaseAuthService, SupabaseConfigService],
})
export class SupabaseModule {}
