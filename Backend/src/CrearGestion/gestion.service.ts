import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGestionDto } from './CreateGestionDto';

export type TipoBusquedaGestion = 'contrato' | 'placa' | 'nit';

@Injectable()
export class GestionService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear nueva observación/gestión y actualizar la última gestión del caso
  async crearGestion(dto: CreateGestionDto) {
    return this.prisma.$transaction(async (tx) => {
      const gestion = await tx.gestionCaso.create({
        data: {
          casoId: dto.casoId,
          tipoObservacion: dto.tipoObservacion,
          comentario: dto.comentario,
          fechaProximaGestion: dto.fechaProximaGestion
            ? new Date(dto.fechaProximaGestion)
            : null,
          analistaResponsable: dto.analistaResponsable,
        },
      });

      await tx.caso.update({
        where: { id: dto.casoId },
        data: { fechaUltimaGestion: gestion.fechaGestion },
      });

      return gestion;
    });
  }

  // Obtener el historial completo por caso
  async obtenerHistorialGestiones(casoId: number) {
    return this.prisma.gestionCaso.findMany({
      where: { casoId },
      orderBy: { fechaGestion: 'desc' },
    });
  }

  // Buscar casos para registrar una gestión
  async buscarCasos(tipo: TipoBusquedaGestion, q: string) {
    const termino = q.trim();

    if (!termino) {
      throw new BadRequestException(
        'El término de búsqueda no puede estar vacío',
      );
    }

    let resultados;

    switch (tipo) {
      case 'contrato':
        resultados = await this.prisma.caso.findMany({
          where: {
            numeroContrato: {
              contains: termino,
              mode: 'insensitive',
            },
          },
          include: {
            vehiculo: true,
            locatario: true,
            estado: true,
          },
        });
        break;

      case 'placa':
        resultados = await this.prisma.caso.findMany({
          where: {
            vehiculoPlaca: {
              equals: termino,
              mode: 'insensitive',
            },
          },
          include: {
            vehiculo: true,
            locatario: true,
            estado: true,
          },
        });
        break;

      case 'nit':
        resultados = await this.prisma.caso.findMany({
          where: {
            locatario: {
              nit: {
                equals: termino,
                mode: 'insensitive',
              },
            },
          },
          include: {
            vehiculo: true,
            locatario: true,
            estado: true,
          },
        });
        break;

      default:
        throw new BadRequestException(
          `Tipo de búsqueda no válido: ${tipo}`,
        );
    }

    return {
      tipo,
      busqueda: termino,
      encontrado: resultados.length > 0,
      data: resultados,
    };
  }
}
