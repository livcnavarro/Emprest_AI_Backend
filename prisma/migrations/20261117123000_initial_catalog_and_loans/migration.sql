-- CreateEnum
CREATE TYPE "equipment_category" AS ENUM ('Notebook', 'Monitor', 'Cabo', 'Câmera', 'Acessório');

-- CreateEnum
CREATE TYPE "equipment_status" AS ENUM ('Disponível', 'Emprestado', 'Em manutenção');

-- CreateEnum
CREATE TYPE "profile_role" AS ENUM ('Colaborador', 'Operações');

-- CreateTable
CREATE TABLE "equipment" (
    "patrimony" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "equipment_category" NOT NULL,
    "status" "equipment_status" NOT NULL,
    "image_path" TEXT NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("patrimony")
);

-- CreateTable
CREATE TABLE "profiles" (
    "auth_user_id" UUID NOT NULL,
    "role" "profile_role" NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("auth_user_id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" UUID NOT NULL,
    "auth_user_id" UUID NOT NULL,
    "equipment_patrimony" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" DATE NOT NULL,
    "returned_at" TIMESTAMPTZ(6),

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "loans_auth_user_id_returned_at_idx" ON "loans"("auth_user_id", "returned_at");

-- CreateIndex
CREATE INDEX "loans_equipment_patrimony_returned_at_idx" ON "loans"("equipment_patrimony", "returned_at");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loans" ADD CONSTRAINT "loans_equipment_patrimony_fkey" FOREIGN KEY ("equipment_patrimony") REFERENCES "equipment"("patrimony") ON DELETE RESTRICT ON UPDATE CASCADE;
