/*
  Warnings:

  - The primary key for the `AuditoriaMulta` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AuditoriaMulta` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Caso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `categoriaId` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `causaAtrasoId` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estadoContratoId` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estadoId` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `etapaId` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `subetapaId` column on the `Caso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Estado` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Estado` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `GestionCaso` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `GestionCaso` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Locatario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Locatario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProcesoJuridico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProcesoJuridico` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tipoSaneamientoARealizarId` column on the `ProcesoJuridico` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Propietario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Propietario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `propietarioId` column on the `Vehiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estadoMatriculaId` column on the `Vehiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `revisionTecnomecanicaId` column on the `Vehiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `soatId` column on the `Vehiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `casoId` on the `AuditoriaMulta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `locatarioId` on the `Caso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `casoId` on the `GestionCaso` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `casoId` on the `ProcesoJuridico` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AuditoriaMulta" DROP CONSTRAINT "AuditoriaMulta_casoId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_causaAtrasoId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_estadoContratoId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_estadoId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_etapaId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_subetapaId_fkey";

-- DropForeignKey
ALTER TABLE "GestionCaso" DROP CONSTRAINT "GestionCaso_casoId_fkey";

-- DropForeignKey
ALTER TABLE "ProcesoJuridico" DROP CONSTRAINT "ProcesoJuridico_casoId_fkey";

-- DropForeignKey
ALTER TABLE "ProcesoJuridico" DROP CONSTRAINT "ProcesoJuridico_tipoSaneamientoARealizarId_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_estadoMatriculaId_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_propietarioId_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_revisionTecnomecanicaId_fkey";

-- DropForeignKey
ALTER TABLE "Vehiculo" DROP CONSTRAINT "Vehiculo_soatId_fkey";

-- AlterTable
ALTER TABLE "AuditoriaMulta" DROP CONSTRAINT "AuditoriaMulta_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "casoId",
ADD COLUMN     "casoId" INTEGER NOT NULL,
ADD CONSTRAINT "AuditoriaMulta_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Caso" DROP CONSTRAINT "Caso_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "locatarioId",
ADD COLUMN     "locatarioId" INTEGER NOT NULL,
DROP COLUMN "categoriaId",
ADD COLUMN     "categoriaId" INTEGER,
DROP COLUMN "causaAtrasoId",
ADD COLUMN     "causaAtrasoId" INTEGER,
DROP COLUMN "estadoContratoId",
ADD COLUMN     "estadoContratoId" INTEGER,
DROP COLUMN "estadoId",
ADD COLUMN     "estadoId" INTEGER,
DROP COLUMN "etapaId",
ADD COLUMN     "etapaId" INTEGER,
DROP COLUMN "subetapaId",
ADD COLUMN     "subetapaId" INTEGER,
ADD CONSTRAINT "Caso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Estado" DROP CONSTRAINT "Estado_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Estado_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GestionCaso" DROP CONSTRAINT "GestionCaso_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "casoId",
ADD COLUMN     "casoId" INTEGER NOT NULL,
ADD CONSTRAINT "GestionCaso_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Locatario" DROP CONSTRAINT "Locatario_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Locatario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProcesoJuridico" DROP CONSTRAINT "ProcesoJuridico_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "casoId",
ADD COLUMN     "casoId" INTEGER NOT NULL,
DROP COLUMN "tipoSaneamientoARealizarId",
ADD COLUMN     "tipoSaneamientoARealizarId" INTEGER,
ADD CONSTRAINT "ProcesoJuridico_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Propietario" DROP CONSTRAINT "Propietario_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Propietario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "propietarioId",
ADD COLUMN     "propietarioId" INTEGER,
DROP COLUMN "estadoMatriculaId",
ADD COLUMN     "estadoMatriculaId" INTEGER,
DROP COLUMN "revisionTecnomecanicaId",
ADD COLUMN     "revisionTecnomecanicaId" INTEGER,
DROP COLUMN "soatId",
ADD COLUMN     "soatId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "AuditoriaMulta_casoId_key" ON "AuditoriaMulta"("casoId");

-- CreateIndex
CREATE UNIQUE INDEX "ProcesoJuridico_casoId_key" ON "ProcesoJuridico"("casoId");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_estadoMatriculaId_fkey" FOREIGN KEY ("estadoMatriculaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_soatId_fkey" FOREIGN KEY ("soatId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_revisionTecnomecanicaId_fkey" FOREIGN KEY ("revisionTecnomecanicaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Propietario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_estadoContratoId_fkey" FOREIGN KEY ("estadoContratoId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_subetapaId_fkey" FOREIGN KEY ("subetapaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_causaAtrasoId_fkey" FOREIGN KEY ("causaAtrasoId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caso" ADD CONSTRAINT "Caso_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "Locatario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoJuridico" ADD CONSTRAINT "ProcesoJuridico_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcesoJuridico" ADD CONSTRAINT "ProcesoJuridico_tipoSaneamientoARealizarId_fkey" FOREIGN KEY ("tipoSaneamientoARealizarId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditoriaMulta" ADD CONSTRAINT "AuditoriaMulta_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GestionCaso" ADD CONSTRAINT "GestionCaso_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
