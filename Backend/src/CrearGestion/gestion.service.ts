// src/CrearGestion/gestion.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGestionDto } from './CreateGestionDto';
import { calcularAlertaActualizacionBase } from '../casos/utils/alerta-actualizacion-base';

export type TipoBusquedaGestion = 'contrato' | 'placa' | 'nit';

@Injectable()
export class GestionService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear nueva observación/gestión, actualizar el Caso y recalcular la alerta en CamposCalculados
  async crearGestion(dto: CreateGestionDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Convertir fecha string "YYYY-MM-DD" a ISO Date sin desfase de zona horaria
      const fechaProxima = dto.fechaProximaGestion
        ? new Date(`${dto.fechaProximaGestion.split('T')[0]}T00:00:00.000Z`)
        : null;

      // 2. Crear el registro en la tabla de Historial de Gestiones
      const gestion = await tx.gestionCaso.create({
        data: {
          casoId: dto.casoId,
          tipoObservacion: dto.tipoObservacion,
          comentario: dto.comentario,
          fechaProximaGestion: fechaProxima,
          analistaResponsable: dto.analistaResponsable,
        },
      });

      // 3. Actualizar los campos correspondientes en la tabla principal Caso
      const casoActualizado = await tx.caso.update({
        where: { id: dto.casoId },
        data: {
          fechaUltimaGestion: gestion.fechaGestion,
          fechaProximaGestion: fechaProxima,
          ...(dto.analistaResponsable && {
            analistaResponsable: dto.analistaResponsable,
          }),
        },
        include: {
          estado: true,
          subetapa: true,
        },
      });

      // 4. Recalcular la nueva alerta de actualización base con la nueva fecha de próxima gestión
      const nuevaAlerta = calcularAlertaActualizacionBase({
        estado: casoActualizado.estado?.nombre,
        analistaResponsable: casoActualizado.analistaResponsable,
        actividad: casoActualizado.subetapa?.nombre,
        fechaProximaGestion: casoActualizado.fechaProximaGestion,
      });

      // 🔍 LOG EN TERMINAL DEL BACKEND
      //console.log(
        //`\x1b[35m[GESTION SERVICE]\x1b[0m Caso ID: \x1b[36m${casoActualizado.id}\x1b[0m | Nueva Próxima Gestión: \x1b[33m${fechaProxima ? fechaProxima.toISOString().split('T')[0] : 'null'}\x1b[0m | Nueva Alerta: \x1b[32m"${nuevaAlerta}"\x1b[0m`
      //);

      // 5. Persistir la alerta calculada en la tabla CamposCalculados
      await tx.camposCalculados.upsert({
        where: { casoId: dto.casoId },
        create: {
          casoId: dto.casoId,
          alertaActualizacionBase: nuevaAlerta,
        },
        update: {
          alertaActualizacionBase: nuevaAlerta,
        },
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