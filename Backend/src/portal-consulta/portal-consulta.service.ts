// src/portal-consulta/portal-consulta.service.ts
// ================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsultarPortalDto } from './dto/consultar-portal.dto';

@Injectable()
export class PortalConsultaService {
  constructor(private readonly prisma: PrismaService) {}

  async consultar(dto: ConsultarPortalDto) {
    const numeroContrato = dto.numeroContrato.trim();
    const documento = dto.documento.trim();

    const caso = await this.prisma.caso.findFirst({
      where: {
        numeroContrato,
        locatario: {
          nit: documento,
        },
      },
      select: {
        numeroContrato: true,
        vehiculoPlaca: true,
        estado: {
          select: { id: true, nombre: true },
        },
        categoria: {
          select: { id: true, nombre: true },
        },
        etapa: {
          select: { id: true, nombre: true },
        },
        subetapa: {
          select: { id: true, nombre: true },
        },
        fechaAsignacion: true,
        fechaProximaGestion: true,
        estadosCaso: {
          orderBy: { fechaInicio: 'asc' },
          select: {
            tipo: true,
            fechaInicio: true,
            fechaFin: true,
            estado: {
              select: { nombre: true },
            },
          },
        },
      },
    });

    if (!caso) {
      throw new NotFoundException(
        'No encontramos un trámite con los datos suministrados.',
      );
    }

    return {
      numeroContrato: caso.numeroContrato,
      vehiculoPlaca: caso.vehiculoPlaca,
      estado: caso.estado,
      categoria: caso.categoria,
      etapa: caso.etapa,
      subetapa: caso.subetapa,
      fechaAsignacion: caso.fechaAsignacion,
      fechaProximaGestion: caso.fechaProximaGestion,
      historial: caso.estadosCaso.map((item) => ({
        tipo: item.tipo,
        nombre: item.estado.nombre,
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
      })),
    };
  }
}
