import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsultarSeguimientoDto } from './dto/consultar-seguimiento.dto';
import {
  SEGUIMIENTO_VERBATIMS,
  SeguimientoGestionContenido,
} from './seguimiento-verbatims';

const normalizar = (value?: string | null) =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const buscarContenidoGestion = (valores: Array<string | null | undefined>) => {
  const candidatos = valores
    .filter((value): value is string => Boolean(value))
    .map(normalizar);

  const coincidenciaExacta = SEGUIMIENTO_VERBATIMS.find((item) => {
    const actividad = normalizar(item.actividad);
    return candidatos.some((candidato) => candidato === actividad);
  });

  if (coincidenciaExacta) return coincidenciaExacta;

  const coincidenciaParcial = SEGUIMIENTO_VERBATIMS.find((item) => {
    const actividad = normalizar(item.actividad);
    return candidatos.some(
      (candidato) =>
        candidato.includes(actividad) || actividad.includes(candidato),
    );
  });

  if (coincidenciaParcial) return coincidenciaParcial;

  const etapa = candidatos[0] ?? 'seguimiento';

  return {
    etapa,
    actividad: valores.find(Boolean) ?? 'Seguimiento del trámite',
    gestion: '👨‍💼 Gestión Gómez Pineda',
    significado:
      'Nuestro equipo está revisando la información disponible para continuar con el trámite.',
    situacion:
      'El trámite se encuentra en seguimiento y será actualizado cuando exista una nueva gestión.',
    requiereAccion: false,
    proximoPaso: 'Continuación de la gestión correspondiente',
  } satisfies SeguimientoGestionContenido;
};

@Injectable()
export class SeguimientoPortalService {
  constructor(private readonly prisma: PrismaService) {}

  async consultar(dto: ConsultarSeguimientoDto) {
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
        fecha: true,
        fechaAsignacion: true,
        fechaProximaGestion: true,
        fechaUltimaGestion: true,
        analistaResponsable: true,
        observacionesGestion: true,
        ultimoComentario: true,
        updatedAt: true,
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
        locatario: {
          select: {
            nit: true,
            nombreBanco: true,
            contactoNombre: true,
          },
        },
        vehiculo: {
          select: {
            placa: true,
            marca: true,
            linea: true,
            modelo: true,
            transito: true,
          },
        },
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

    const ultimoHistorial = caso.estadosCaso.at(-1);
    const contenido = buscarContenidoGestion([
      caso.subetapa?.nombre,
      caso.etapa?.nombre,
      ultimoHistorial?.estado.nombre,
    ]);

    return {
      caso: {
        numeroContrato: caso.numeroContrato,
        fecha: caso.fecha,
        fechaAsignacion: caso.fechaAsignacion,
        fechaProximaGestion: caso.fechaProximaGestion,
        fechaUltimaGestion: caso.fechaUltimaGestion,
        analistaResponsable: caso.analistaResponsable,
        observacionesGestion: caso.observacionesGestion,
        ultimoComentario: caso.ultimoComentario,
        estado: caso.estado,
        categoria: caso.categoria,
        etapa: caso.etapa,
        subetapa: caso.subetapa,
      },
      locatario: {
        nit: caso.locatario.nit,
        nombre: caso.locatario.contactoNombre ?? caso.locatario.nombreBanco,
      },
      vehiculo: caso.vehiculo,
      gestionActual: {
        actividad: contenido.actividad,
        responsable: contenido.gestion,
        significado: contenido.significado,
        situacion: contenido.situacion,
        requiereAccion: contenido.requiereAccion,
        proximoPaso: contenido.proximoPaso,
      },
      historial: caso.estadosCaso.map((item) => ({
        tipo: item.tipo,
        nombre: item.estado.nombre,
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
      })),
      ultimaActualizacion: caso.fechaUltimaGestion ?? caso.updatedAt,
    };
  }
}
