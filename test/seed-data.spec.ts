import {
  EquipmentCategory,
  EquipmentStatus,
  ProfileRole,
} from '@prisma/client';
import {
  EquipmentSeed,
  INITIAL_EQUIPMENT,
  ProfileSeed,
  SeedClient,
  syncInitialData,
} from '../prisma/seed-data';

const AUTH_USER_ID = '00000000-0000-4000-8000-000000000001';

function createSeedClient(
  equipment: EquipmentSeed[] = [],
  profile: ProfileSeed | null = null,
) {
  const equipmentByPatrimony = new Map(
    equipment.map((record) => [record.patrimony, record]),
  );
  let savedProfile = profile;
  const equipmentCreate = jest.fn(async ({ data }: { data: EquipmentSeed }) => {
    equipmentByPatrimony.set(data.patrimony, data);
    return data;
  });
  const profileCreate = jest.fn(async ({ data }: { data: ProfileSeed }) => {
    savedProfile = data;
    return data;
  });
  const client: SeedClient = {
    equipment: {
      findMany: async ({ where }) =>
        where.patrimony.in.flatMap((patrimony) => {
          const record = equipmentByPatrimony.get(patrimony);
          return record ? [record] : [];
        }),
      create: equipmentCreate,
    },
    profile: {
      findUnique: async () => savedProfile,
      create: profileCreate,
    },
  };

  return {
    client,
    equipmentByPatrimony,
    equipmentCreate,
    profileCreate,
  };
}

describe('seed inicial — CA-03 e CA-05', () => {
  it('cria os 12 equipamentos e o perfil Operações, sem duplicar ao repetir', async () => {
    const seed = createSeedClient();

    await syncInitialData(seed.client, AUTH_USER_ID);
    await syncInitialData(seed.client, AUTH_USER_ID);

    expect(INITIAL_EQUIPMENT).toHaveLength(12);
    expect(seed.equipmentByPatrimony.size).toBe(12);
    expect(seed.equipmentCreate).toHaveBeenCalledTimes(12);
    expect(seed.profileCreate).toHaveBeenCalledTimes(1);
    expect(seed.profileCreate).toHaveBeenCalledWith({
      data: { authUserId: AUTH_USER_ID, role: ProfileRole.Operacoes },
    });
    expect(
      seed.equipmentByPatrimony.get('TI-0004')?.status,
    ).toBe(EquipmentStatus.EmManutencao);
    expect(
      seed.equipmentByPatrimony.get('TI-0007')?.status,
    ).toBe(EquipmentStatus.EmManutencao);
    expect(
      seed.equipmentByPatrimony.get('TI-0010')?.status,
    ).toBe(EquipmentStatus.Disponivel);
    expect(
      seed.equipmentByPatrimony.get('TI-0001')?.category,
    ).toBe(EquipmentCategory.Notebook);
  });

  it('interrompe antes de gravar quando um equipamento diverge', async () => {
    const divergentEquipment = {
      ...INITIAL_EQUIPMENT[0],
      name: 'Nome divergente',
    };
    const seed = createSeedClient([divergentEquipment]);

    await expect(
      syncInitialData(seed.client, AUTH_USER_ID),
    ).rejects.toThrow('TI-0001 diverge');

    expect(seed.equipmentCreate).not.toHaveBeenCalled();
    expect(seed.profileCreate).not.toHaveBeenCalled();
  });

  it('interrompe antes de gravar quando o perfil existente não é Operações', async () => {
    const existingProfile = {
      authUserId: AUTH_USER_ID,
      role: ProfileRole.Colaborador,
    };
    const seed = createSeedClient([], existingProfile);

    await expect(
      syncInitialData(seed.client, AUTH_USER_ID),
    ).rejects.toThrow('papel diferente de Operações');

    expect(seed.equipmentCreate).not.toHaveBeenCalled();
    expect(seed.profileCreate).not.toHaveBeenCalled();
  });
});
