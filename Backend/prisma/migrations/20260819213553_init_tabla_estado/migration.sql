/*
  Warnings:

  - You are about to drop the column `categoria` on the `Caso` table. All the data in the column will be lost.
  - You are about to drop the column `causaAtraso` on the `Caso` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `Caso` table. All the data in the column will be lost.
  - You are about to drop the column `estadoContrato` on the `Caso` table. All the data in the column will be lost.
  - You are about to drop the column `etapa` on the `Caso` table. All the data in the column will be lost.
  - You are about to drop the column `subetapa` on the `Caso` table. All the data in the column will be lost.
  - You are about to drop the column `tipoSaneamientoARealizar` on the `ProcesoJuridico` table. All the data in the column will be lost.
  - You are about to drop the column `estadoMatricula` on the `Vehiculo` table. All the data in the column will be lost.
  - You are about to drop the column `revisionTecnomecanica` on the `Vehiculo` table. All the data in the column will be lost.
  - You are about to drop the column `soat` on the `Vehiculo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Caso" DROP COLUMN "categoria",
DROP COLUMN "causaAtraso",
DROP COLUMN "estado",
DROP COLUMN "estadoContrato",
DROP COLUMN "etapa",
DROP COLUMN "subetapa",
ADD COLUMN     "categoriaId" TEXT,
ADD COLUMN     "causaAtrasoId" TEXT,
ADD COLUMN     "estadoContratoId" TEXT,
ADD COLUMN     "estadoId" TEXT,
ADD COLUMN     "etapaId" TEXT,
ADD COLUMN     "subetapaId" TEXT;

-- AlterTable
ALTER TABLE "ProcesoJuridico" DROP COLUMN "tipoSaneamientoARealizar",
ADD COLUMN     "tipoSaneamientoARealizarId" TEXT;

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "estadoMatricula",
DROP COLUMN "revisionTecnomecanica",
DROP COLUMN "soat",
ADD COLUMN     "estadoMatriculaId" TEXT,
ADD COLUMN     "revisionTecnomecanicaId" TEXT,
ADD COLUMN     "soatId" TEXT;

-- CreateTable
CREATE TABLE "Estado" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Estado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_estadoMatriculaId_fkey" FOREIGN KEY ("estadoMatriculaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_soatId_fkey" FOREIGN KEY ("soatId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_revisionTecnomecanicaId_fkey" FOREIGN KEY ("revisionTecnomecanicaId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "ProcesoJuridico" ADD CONSTRAINT "ProcesoJuridico_tipoSaneamientoARealizarId_fkey" FOREIGN KEY ("tipoSaneamientoARealizarId") REFERENCES "Estado"("id") ON DELETE SET NULL ON UPDATE CASCADE;
