import {
  EquipmentCategory,
  EquipmentStatus,
  ProfileRole,
} from '@prisma/client';

export interface EquipmentSeed {
  patrimony: string;
  name: string;
  category: EquipmentCategory;
  status: EquipmentStatus;
  imagePath: string;
}

export interface ProfileSeed {
  authUserId: string;
  role: ProfileRole;
}

export interface SeedClient {
  equipment: {
    findMany(args: {
      where: { patrimony: { in: string[] } };
    }): Promise<EquipmentSeed[]>;
    create(args: { data: EquipmentSeed }): Promise<EquipmentSeed>;
  };
  profile: {
    findUnique(args: {
      where: { authUserId: string };
    }): Promise<ProfileSeed | null>;
    create(args: { data: ProfileSeed }): Promise<ProfileSeed>;
  };
}

export const INITIAL_EQUIPMENT: readonly EquipmentSeed[] = [
  {
    patrimony: 'TI-0001',
    name: 'Notebook 14 polegadas',
    category: EquipmentCategory.Notebook,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0001.jpg',
  },
  {
    patrimony: 'TI-0002',
    name: 'Notebook 15 polegadas',
    category: EquipmentCategory.Notebook,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0002.jpg',
  },
  {
    patrimony: 'TI-0003',
    name: 'Notebook 13 polegadas',
    category: EquipmentCategory.Notebook,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0003.jpg',
  },
  {
    patrimony: 'TI-0004',
    name: 'Notebook 15 polegadas',
    category: EquipmentCategory.Notebook,
    status: EquipmentStatus.EmManutencao,
    imagePath: 'equipamentos/TI-0004.jpg',
  },
  {
    patrimony: 'TI-0005',
    name: 'Monitor 24 polegadas',
    category: EquipmentCategory.Monitor,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0005.jpg',
  },
  {
    patrimony: 'TI-0006',
    name: 'Monitor 27 polegadas',
    category: EquipmentCategory.Monitor,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0006.jpg',
  },
  {
    patrimony: 'TI-0007',
    name: 'Monitor 22 polegadas',
    category: EquipmentCategory.Monitor,
    status: EquipmentStatus.EmManutencao,
    imagePath: 'equipamentos/TI-0007.jpg',
  },
  {
    patrimony: 'TI-0008',
    name: 'Cabo HDMI 2 m',
    category: EquipmentCategory.Cabo,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0008.jpg',
  },
  {
    patrimony: 'TI-0009',
    name: 'Cabo USB-C 1 m',
    category: EquipmentCategory.Cabo,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0009.jpg',
  },
  {
    patrimony: 'TI-0010',
    name: 'Cabo de rede 3 m',
    category: EquipmentCategory.Cabo,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0010.jpg',
  },
  {
    patrimony: 'TI-0011',
    name: 'Webcam Full HD',
    category: EquipmentCategory.Camera,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0011.jpg',
  },
  {
    patrimony: 'TI-0012',
    name: 'Câmera compacta',
    category: EquipmentCategory.Camera,
    status: EquipmentStatus.Disponivel,
    imagePath: 'equipamentos/TI-0012.jpg',
  },
];

const INITIAL_PROFILE_ROLE = ProfileRole.Operacoes;

function isSameEquipment(
  existing: EquipmentSeed,
  expected: EquipmentSeed,
): boolean {
  return (
    existing.patrimony === expected.patrimony &&
    existing.name === expected.name &&
    existing.category === expected.category &&
    existing.status === expected.status &&
    existing.imagePath === expected.imagePath
  );
}

export async function syncInitialData(
  client: SeedClient,
  authUserId: string,
): Promise<void> {
  const [existingEquipment, existingProfile] = await Promise.all([
    client.equipment.findMany({
      where: {
        patrimony: {
          in: INITIAL_EQUIPMENT.map(({ patrimony }) => patrimony),
        },
      },
    }),
    client.profile.findUnique({ where: { authUserId } }),
  ]);
  const existingByPatrimony = new Map(
    existingEquipment.map((equipment) => [equipment.patrimony, equipment]),
  );

  for (const expected of INITIAL_EQUIPMENT) {
    const existing = existingByPatrimony.get(expected.patrimony);
    if (existing && !isSameEquipment(existing, expected)) {
      throw new Error(
        `Seed interrompido: o equipamento ${expected.patrimony} diverge dos dados aprovados.`,
      );
    }
  }

  if (existingProfile && existingProfile.role !== INITIAL_PROFILE_ROLE) {
    throw new Error(
      'Seed interrompido: o perfil existente tem papel diferente de Operações.',
    );
  }

  for (const expected of INITIAL_EQUIPMENT) {
    if (!existingByPatrimony.has(expected.patrimony)) {
      await client.equipment.create({ data: expected });
    }
  }

  if (!existingProfile) {
    await client.profile.create({
      data: { authUserId, role: INITIAL_PROFILE_ROLE },
    });
  }
}
