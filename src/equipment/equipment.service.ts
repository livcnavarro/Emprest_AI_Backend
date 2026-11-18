import { Injectable } from '@nestjs/common';
import {
  EquipmentCategory,
  EquipmentStatus,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { SupabaseConfigService } from '../supabase/supabase-config.service';
import { IMAGE_SOURCES } from './image-sources';

const categoryLabels: Record<EquipmentCategory, string> = {
  [EquipmentCategory.Notebook]: 'Notebook',
  [EquipmentCategory.Monitor]: 'Monitor',
  [EquipmentCategory.Cabo]: 'Cabo',
  [EquipmentCategory.Camera]: 'Câmera',
  [EquipmentCategory.Accessory]: 'Acessório',
};

const statusLabels: Record<EquipmentStatus, string> = {
  [EquipmentStatus.Disponivel]: 'Disponível',
  [EquipmentStatus.Emprestado]: 'Emprestado',
  [EquipmentStatus.EmManutencao]: 'Em manutenção',
};

const equipmentSelection = {
  patrimony: true,
  name: true,
  category: true,
  status: true,
  imagePath: true,
} satisfies Prisma.EquipmentSelect;

@Injectable()
export class EquipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabase: SupabaseConfigService,
  ) {}

  async list(authUserId: string) {
    const equipment = await this.prisma.withAuthenticatedUser(
      authUserId,
      (transaction) =>
        transaction.equipment.findMany({
          select: equipmentSelection,
          orderBy: { patrimony: 'asc' },
        }),
    );

    return equipment.map((item) => ({
      patrimony: item.patrimony,
      name: item.name,
      category: categoryLabels[item.category],
      status: statusLabels[item.status],
      imageUrl: this.supabase.getPublicStorageUrl(item.imagePath),
      imageSourceUrl: IMAGE_SOURCES[item.patrimony] ?? null,
    }));
  }
}
