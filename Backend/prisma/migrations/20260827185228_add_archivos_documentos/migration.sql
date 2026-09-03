-- CreateEnum
CREATE TYPE "EstadoArchivo" AS ENUM ('PENDIENTE', 'SUBIDO', 'ERROR', 'ELIMINADO');

-- CreateTable
CREATE TABLE "TipoDocumento" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "obligatorio" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoDocumento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Archivo" (
    "id" SERIAL NOT NULL,
    "casoId" INTEGER NOT NULL,
    "tipoDocumentoId" INTEGER NOT NULL,
    "nombreOriginal" TEXT NOT NULL,
    "blobName" TEXT NOT NULL,
    "containerName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "estado" "EstadoArchivo" NOT NULL DEFAULT 'SUBIDO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Archivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TipoDocumento_codigo_key" ON "TipoDocumento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Archivo_blobName_key" ON "Archivo"("blobName");

-- CreateIndex
CREATE INDEX "Archivo_casoId_idx" ON "Archivo"("casoId");

-- CreateIndex
CREATE INDEX "Archivo_casoId_tipoDocumentoId_idx" ON "Archivo"("casoId", "tipoDocumentoId");

-- AddForeignKey
ALTER TABLE "Archivo" ADD CONSTRAINT "Archivo_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Archivo" ADD CONSTRAINT "Archivo_tipoDocumentoId_fkey" FOREIGN KEY ("tipoDocumentoId") REFERENCES "TipoDocumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
