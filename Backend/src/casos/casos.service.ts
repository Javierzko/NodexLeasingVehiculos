//raiz src/casos/casos.services

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

@Injectable()
export class CasosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly estadosCasoService: EstadosCasoService,
  ) {}

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
    estado: true,
    categoria: true,
    etapa: true,
    subetapa: true,
    causaAtraso: true,
    estadoContrato: true,
  };

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
        caso.etapaId ?? null ,
        caso.subetapaId ?? null,
      );

      return caso;
    });
  }

  findAll() {
    return this.prisma.caso.findMany({
      include: this.includeCasoCompleto,
    });
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

    return caso;
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

    return caso;
  }

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

    console.log(
      'DATOS DEL CASO QUE LLEGAN AL BACKEND:',
      datosCaso,
    );

    console.log(
      'PROCESO JURIDICO QUE LLEGA AL BACKEND:',
      datosProcesoJuridico,
    );

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
              :casoActual.categoriaId,
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
        console.log(
          'ACTUALIZANDO PROCESO JURIDICO:',
          datosProcesoJuridico,
        );

        await tx.procesoJuridico.update({
          where: {
            casoId: id,
          },
          data: datosProcesoJuridico,
        });
      }

      return tx.caso.findUnique({
        where: { id },
        include: this.includeCasoCompleto,
      });
    });
  }

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