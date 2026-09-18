// src/casos/casos.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCasoDto } from './dto/create-caso.dto';
import { UpdateCasoDto } from './dto/update-caso.dto';
import { Prisma } from '@prisma/client';
import { EstadosCasoService } from './estados-caso/estados-caso.service';
import { calcularAlertaActualizacionBase } from './utils/alerta-actualizacion-base';

@Injectable()
export class CasosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly estadosCasoService: EstadosCasoService,
  ) {}

  // =========================================================================
  // RELACIONES INCLUIDAS EN LAS CONSULTAS (INCLUYE CAMPOS CALCULADOS)
  // =========================================================================
  private readonly includeCasoCompleto = {
    locatario: true,
    vehiculo: {
      include: {
        propietario: true,
        estadoMatricula: true,
      },
    },
    procesoJuridico: {
      include: {
        tipoSaneamientoARealizar: true,
      },
    },
    auditoriaMulta: true,
    camposCalculados: true, // Se incluye para retornar las alertas al frontend
    estado: true,
    categoria: true,
    etapa: true,
    subetapa: true,
    causaAtraso: true,
    estadoContrato: true,
  };
  
// =========================================================================
// NORMALIZADOR DE CAMPOS CALCULADOS Y CÁLCULO EN VIVO
// =========================================================================
private normalizarCasoConCalculos(caso: any) {
  if (!caso) return caso;

  const alertaOriginal = caso.camposCalculados?.alertaActualizacionBase;
  let alertaFinal = typeof alertaOriginal === 'string' ? alertaOriginal.trim() : '';

  // Descartar valores booleanos guardados como texto residual ("false" o "true")
  if (alertaFinal === 'false' || alertaFinal === 'true') {
    alertaFinal = '';
  }

  // Si no hay un texto de alerta válido, ejecuta el cálculo en vivo
  if (!alertaFinal) {
    alertaFinal = calcularAlertaActualizacionBase({
      estado: caso.estado?.nombre,
      analistaResponsable: caso.analistaResponsable,
      actividad: caso.subetapa?.nombre,
      fechaProximaGestion: caso.fechaProximaGestion,
    });
  }

  // 🔍 LOG EN TERMINAL DEL BACKEND
  //console.log(
  //  `\x1b[33m[BACKEND CASOS SERVICE]\x1b[0m Caso ID: \x1b[36m${caso.id}\x1b[0m | Contrato: \x1b[36m${caso.numeroContrato}\x1b[0m | BD Original: \x1b[31m${JSON.stringify(alertaOriginal)}\x1b[0m => Enviado: \x1b[32m"${alertaFinal}"\x1b[0m`
  //);

  return {
    ...caso,
    camposCalculados: {
      ...caso.camposCalculados,
      alertaActualizacionBase: alertaFinal,
    },
  };
}

  // =========================================================================
  // MÉTODOS DE CONVERSIÓN Y FORMATEO DE FECHAS
  // =========================================================================
  private convertirFechas<T extends object>(
    datos: T,
    camposFecha: string[],
  ): T {
    const resultado: any = { ...datos };

    for (const campo of camposFecha) {
      const valor = resultado[campo];

      if (valor === undefined || valor === null) {
        continue;
      }

      if (valor instanceof Date) {
        resultado[campo] = isNaN(valor.getTime()) ? null : valor;
        continue;
      }

      if (typeof valor === 'string') {
        const fechaTexto = valor.trim();

        if (!fechaTexto) {
          resultado[campo] = null;
          continue;
        }

        const fecha =
          /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
            ? new Date(`${fechaTexto}T00:00:00.000Z`)
            : new Date(fechaTexto);

        resultado[campo] = isNaN(fecha.getTime()) ? null : fecha;
      }
    }

    return resultado as T;
  }

  private readonly camposFechaCaso = [
    'fechaValidacionRunt',
    'fechaComparendo',
    'fecha',
    'fechaAsignacion',
    'fechaCierreTraspaso',
    'fechaDebesEnviarNotificacion',
    'fechaNotificacionInicial',
    'fechaUltimaNotificacion',
    'fechaProximaNotificacion',
    'fechaUltimaGestion',
    'fechaProximaGestion',
    'fechaSolicitudSuspension',
    'fechaHastaSuspension',
    'fechaInicioCitaTransito',
    'fechaConsecucionCitaTransito',
    'fechaCitaTransito',
    'fechaRadicacionTraspaso',
    'fechaRechazo',
    'fechaSubsanacionRechazo',
    'fechaTraspasoAprobado',
    'fechaCierreTraspasoBizagi',
    'fechaEntregaDatosEnvio',
    'fechaProgramacionEntregaTp',
    'fechaEntregaTpLocatario',
    'fechaFactura',
    'fechaFacturaJuridico',
  ];

  private readonly camposFechaProcesoJuridico = [
    'fechaInicio',
    'fechaUltimaActuacion',
    'fechaEscalamientoEntidadEx',
    'fechaRespuestaEntidadEx',
    'fechaLiquidacionTotalPasivos',
    'fechaSolicitudRecursos',
    'fechaDesembolsoRecursos',
    'fechaFinDiagnosticoPagoPasivos',
    'fechaSolicitudSaneamientoJuridico',
    'fechaFinSaneamientoJuridico',
    'fechaRadicacionDp',
    'fechaRespuestaDp',
    'fechaRadicacionTutela',
    'fechaSolicitudDocsAdicionalesTraspaso',
    'fechaEntregaDocsAdicionalesTraspaso',
    'fechaFinGestionDocumentalTraspaso',
  ];

  // =========================================================================
  // CREACIÓN DE CASOS
  // =========================================================================
  async create(createCasoDto: CreateCasoDto) {
    const existe = await this.prisma.caso.findFirst({
      where: {
        numeroContrato: createCasoDto.numeroContrato,
      },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un caso registrado con el número de contrato ${createCasoDto.numeroContrato}.`,
      );
    }

    const {
      procesoJuridico,
      auditoriaMulta,
      ...datos
    } = createCasoDto;

    const datosCaso = this.convertirFechas(
      datos,
      this.camposFechaCaso,
    );

    const datosProcesoJuridico = procesoJuridico
      ? this.convertirFechas(
          procesoJuridico,
          this.camposFechaProcesoJuridico,
        )
      : undefined;

    return this.prisma.$transaction(async (tx) => {
      const caso = await tx.caso.create({
        data: {
          ...datosCaso,

          ...(datosProcesoJuridico && {
            procesoJuridico: {
              create: datosProcesoJuridico,
            },
          }),

          ...(auditoriaMulta && {
            auditoriaMulta: {
              create: auditoriaMulta,
            },
          }),
        },
        include: this.includeCasoCompleto,
      });

      await this.estadosCasoService.inicializarHistorial(
        tx,
        caso.id,
        caso.estadoId ?? null,
        caso.categoriaId ?? null,
        caso.etapaId ?? null,
        caso.subetapaId ?? null,
      );

      // Creación del registro inicial de campos calculados / alertas
      const alertaInicial = calcularAlertaActualizacionBase({
        estado: caso.estado?.nombre,
        analistaResponsable: caso.analistaResponsable,
        actividad: caso.subetapa?.nombre,
        fechaProximaGestion: caso.fechaProximaGestion,
      });

      await tx.camposCalculados.create({
        data: {
          casoId: caso.id,
          alertaActualizacionBase: alertaInicial,
        },
      });

      const casoCreado = await tx.caso.findUnique({
        where: { id: caso.id },
        include: this.includeCasoCompleto,
      });

      return this.normalizarCasoConCalculos(casoCreado);
    });
  }

  // =========================================================================
  // CONSULTAS (FIND ALL / FIND ONE / FIND BY CONTRACT)
  // =========================================================================
  async findAll() {
    const casos = await this.prisma.caso.findMany({
      include: this.includeCasoCompleto,
    });

    return casos.map((c) => this.normalizarCasoConCalculos(c));
  }

  async findOne(id: number) {
    const caso = await this.prisma.caso.findUnique({
      where: { id },
      include: this.includeCasoCompleto,
    });

    if (!caso) {
      throw new NotFoundException(
        `Caso con ID ${id} no encontrado.`,
      );
    }

    return this.normalizarCasoConCalculos(caso);
  }

  async findByNumeroContrato(numeroContrato: string) {
    const caso = await this.prisma.caso.findFirst({
      where: { numeroContrato },
      include: this.includeCasoCompleto,
    });

    if (!caso) {
      throw new NotFoundException(
        `Caso con contrato ${numeroContrato} no encontrado.`,
      );
    }

    return this.normalizarCasoConCalculos(caso);
  }

  // =========================================================================
  // ACTUALIZACIÓN DE CASOS
  // =========================================================================
  async update(id: number, updateCasoDto: UpdateCasoDto) {
    const casoActual = await this.prisma.caso.findUnique({
      where: { id },
      select: {
        id: true,
        estadoId: true,
        categoriaId: true,
        etapaId: true,
        subetapaId: true,
      },
    });

    if (!casoActual) {
      throw new NotFoundException(
        `Caso con ID ${id} no encontrado.`,
      );
    }

    const {
      procesoJuridico,
      auditoriaMulta,
      ...datos
    } = updateCasoDto;

    const datosCaso = this.convertirFechas(
      datos,
      this.camposFechaCaso,
    );

    const datosProcesoJuridico = procesoJuridico
      ? this.convertirFechas(
          procesoJuridico,
          this.camposFechaProcesoJuridico,
        )
      : undefined;

    return this.prisma.$transaction(async (tx) => {
      await tx.caso.update({
        where: { id },
        data: datosCaso as Prisma.CasoUncheckedUpdateInput,
      });

      await this.estadosCasoService.registrarCambios(
        tx,
        id,
        [
          {
            tipo: 'ESTADO',
            anteriorId: casoActual.estadoId,
            nuevoId:
              datosCaso.estadoId !== undefined
                ? datosCaso.estadoId ?? null
                : casoActual.estadoId,
          },
          {
            tipo: 'CATEGORIA',
            anteriorId: casoActual.categoriaId,
            nuevoId:
              datosCaso.categoriaId !== undefined
                ? datosCaso.categoriaId ?? null
                : casoActual.categoriaId,
          },
          {
            tipo: 'ETAPA',
            anteriorId: casoActual.etapaId,
            nuevoId:
              datosCaso.etapaId !== undefined
                ? datosCaso.etapaId ?? null
                : casoActual.etapaId,
          },
          {
            tipo: 'SUBETAPA',
            anteriorId: casoActual.subetapaId,
            nuevoId:
              datosCaso.subetapaId !== undefined
                ? datosCaso.subetapaId ?? null
                : casoActual.subetapaId,
          },
        ],
      );

      if (datosProcesoJuridico) {
        await tx.procesoJuridico.update({
          where: {
            casoId: id,
          },
          data: datosProcesoJuridico,
        });
      }

      // Obtiene el estado actualizado con relaciones para recalcular la alerta
      const casoActualizado = await tx.caso.findUnique({
        where: { id },
        include: {
          estado: true,
          subetapa: true,
        },
      });

      if (casoActualizado) {
        const nuevaAlerta = calcularAlertaActualizacionBase({
          estado: casoActualizado.estado?.nombre,
          analistaResponsable: casoActualizado.analistaResponsable,
          actividad: casoActualizado.subetapa?.nombre,
          fechaProximaGestion: casoActualizado.fechaProximaGestion,
        });

        await tx.camposCalculados.upsert({
          where: { casoId: id },
          create: {
            casoId: id,
            alertaActualizacionBase: nuevaAlerta,
          },
          update: {
            alertaActualizacionBase: nuevaAlerta,
          },
        });
      }

      const casoFinal = await tx.caso.findUnique({
        where: { id },
        include: this.includeCasoCompleto,
      });

      return this.normalizarCasoConCalculos(casoFinal);
    });
  }

  // =========================================================================
  // ELIMINACIÓN DE CASOS Y LOCATARIOS
  // =========================================================================
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.caso.delete({
      where: { id },
    });
  }

  async removeLocatario(locatarioId: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { id: locatarioId },
      include: {
        casos: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!locatario) {
      throw new NotFoundException(
        `Locatario con ID ${locatarioId} no encontrado.`,
      );
    }

    if (locatario.casos.length > 0) {
      throw new ConflictException(
        `No se puede eliminar el locatario porque tiene ${locatario.casos.length} contrato(s) asociado(s).`,
      );
    }

    return this.prisma.locatario.delete({
      where: { id: locatarioId },
    });
  }
}