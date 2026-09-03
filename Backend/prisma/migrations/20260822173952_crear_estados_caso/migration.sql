-- CreateTable
CREATE TABLE "EstadosCaso" (
    "id" SERIAL NOT NULL,
    "casoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "estadoId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstadosCaso_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EstadosCaso" ADD CONSTRAINT "EstadosCaso_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "Caso"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstadosCaso" ADD CONSTRAINT "EstadosCaso_estadoId_fkey" FOREIGN KEY ("estadoId") REFERENCES "Estado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
