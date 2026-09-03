import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CambiarEstadoMasivoDto } from './dto/cambiar-estado-masivo.dto';
import { EstadosCasoService } from '../casos/estados-caso/estados-caso.service';

@Injectable()
export class GestionMasivaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly estadosCasoService: EstadosCasoService,
  ) {}

  async cambiarEstadoMasivo(dto: CambiarEstadoMasivoDto) {
    const {
      casoIds,
      estadoId,
      categoriaId,
      etapaId,
      subetapaId,
    } = dto;

    const data: Prisma.CasoUncheckedUpdateManyInput = {
      ...(estadoId !== undefined ? { estadoId } : {}),
      ...(categoriaId !== undefined ? { categoriaId } : {}),
      ...(etapaId !== undefined ? { etapaId } : {}),
      ...(subetapaId !== undefined ? { subetapaId } : {}),
    };

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Debe enviar al menos un nuevo valor: estado, categoría, etapa o subetapa.',
      );
    }

    await this.validarCatalogos({
      estadoId,
      categoriaId,
      etapaId,
      subetapaId,
    });

    return this.prisma.$transaction(async (tx) => {
      const casos = await tx.caso.findMany({
        where: { id: { in: casoIds } },
        select: {
          id: true,
          estadoId: true,
          categoriaId: true,
          etapaId: true,
          subetapaId: true,
        },
      });

      if (casos.length !== new Set(casoIds).size) {
        throw new NotFoundException(
          'Uno o más casos enviados no fueron encontrados.',
        );
      }

      const resultado = await tx.caso.updateMany({
        where: { id: { in: casoIds } },
        data,
      });

      for (const caso of casos) {
        await this.estadosCasoService.registrarCambios(tx, caso.id, [
          {
            tipo: 'ESTADO',
            anteriorId: caso.estadoId,
            nuevoId: estadoId ?? caso.estadoId,
          },
          {
            tipo: 'CATEGORIA',
            anteriorId: caso.categoriaId,
            nuevoId: categoriaId ?? caso.categoriaId,
          },
          {
            tipo: 'ETAPA',
            anteriorId: caso.etapaId,
            nuevoId: etapaId ?? caso.etapaId,
          },
          {
            tipo: 'SUBETAPA',
            anteriorId: caso.subetapaId,
            nuevoId: subetapaId ?? caso.subetapaId,
          },
        ]);
      }

      return {
        mensaje: 'Casos y su historial fueron actualizados correctamente.',
        cantidadActualizados: resultado.count,
      };
    });
  }

  private async validarCatalogos(valores: {
    estadoId?: number;
    categoriaId?: number;
    etapaId?: number;
    subetapaId?: number;
  }): Promise<void> {
    const ids = Object.values(valores).filter(
      (id): id is number => id !== undefined,
    );

    const catalogos = await this.prisma.estado.findMany({
      where: {
        id: { in: ids },
        activo: true,
      },
      select: { id: true },
    });

    const encontrados = new Set(catalogos.map((item) => item.id));
    const invalido = ids.find((id) => !encontrados.has(id));

    if (invalido !== undefined) {
      throw new NotFoundException(
        `El catálogo con ID ${invalido} no existe o está inactivo.`,
      );
    }
  }
}
