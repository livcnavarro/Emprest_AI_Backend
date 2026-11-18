import { Module } from '@nestjs/common';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { SupabaseModule } from '../supabase/supabase.module';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';

@Module({
  imports: [SupabaseModule],
  controllers: [EquipmentController],
  providers: [EquipmentService, SupabaseAuthGuard],
})
export class EquipmentModule {}
