import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/authenticated-request';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { EquipmentService } from './equipment.service';

@Controller('api/equipment')
@UseGuards(SupabaseAuthGuard)
export class EquipmentController {
  constructor(private readonly equipment: EquipmentService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest) {
    return this.equipment.list(request.authUserId);
  }
}
