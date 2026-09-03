-- CreateTable
CREATE TABLE "GestionCaso" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "tipoObservacion" TEXT NOT NULL,
    "comentario" TEXT NOT NULL,
    "fechaGestion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaProximaGestion" TIMESTAMP(3),
    "analistaResponsable" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GestionCaso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GestionCaso" ADD CONSTRAINT "GestionCaso_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;
