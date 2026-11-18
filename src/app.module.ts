import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './database/prisma.module';
import { EquipmentModule } from './equipment/equipment.module';
import { LoanModule } from './loans/loan.module';

@Module({
  imports: [PrismaModule, EquipmentModule, LoanModule],
  controllers: [AppController],
})
export class AppModule {}
