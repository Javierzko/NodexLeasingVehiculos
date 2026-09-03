// raiz src/casos/estados-caso/estados-caso.service

import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

type PrismaTransaction = Prisma.TransactionClient | PrismaClient;

type TipoCambio = 'ESTADO' | 'CATEGORIA' | 'ETAPA' | 'SUBETAPA';

type CambioEstadoCaso = {
  tipo: TipoCambio;
  anteriorId: number | null;
  nuevoId: number | null;
};

@Injectable()
export class EstadosCasoService {
  async registrarCambios(
    prisma: PrismaTransaction,
    casoId: number,
    cambios: CambioEstadoCaso[],
  ): Promise<void> {
    const ahora = new Date();

    for (const cambio of cambios) {
      if (cambio.anteriorId === cambio.nuevoId) {
        continue;
      }

      await prisma.estadosCaso.updateMany({
        where: {
          casoId,
          tipo: cambio.tipo,
          ...(cambio.anteriorId !== null
            ? { estadoId: cambio.anteriorId }
            : {}),
          fechaFin: null,
        },
        data: { fechaFin: ahora },
      });

      if (cambio.nuevoId !== null) {
        await prisma.estadosCaso.create({
          data: {
            casoId,
            tipo: cambio.tipo,
            estadoId: cambio.nuevoId,
            fechaInicio: ahora,
          },
        });
      }
    }
  }

  async inicializarHistorial(
    prisma: PrismaTransaction,
    casoId: number,
    estadoId: number | null,
    categoriaId: number | null,
    etapaId: number | null,
    subetapaId: number | null,
  ): Promise<void> {
    const ahora = new Date();

    const registros = [
      { tipo: 'ESTADO' as const, estadoId },
      { tipo: 'CATEGORIA' as const, estadoId: categoriaId },
      { tipo: 'ETAPA' as const, estadoId: etapaId },
      { tipo: 'SUBETAPA' as const, estadoId: subetapaId },
    ].filter(
      (
        registro,
      ): registro is {
        tipo: TipoCambio;
        estadoId: number;
      } => registro.estadoId !== null,
    );

    if (registros.length === 0) {
      return;
    }

    await prisma.estadosCaso.createMany({
      data: registros.map((registro) => ({
        casoId,
        tipo: registro.tipo,
        estadoId: registro.estadoId,
        fechaInicio: ahora,
      })),
    });
  }
}