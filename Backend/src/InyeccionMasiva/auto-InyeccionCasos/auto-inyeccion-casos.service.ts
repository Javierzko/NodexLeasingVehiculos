// raiz/src/inyeccionMasiva/auto-inyeccion-casos.service.ts

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AutoInyeccionCasoFilaDto,
  AutoInyeccionCasosDto,
} from '../dto/auto-inyeccion-casos.dto';

type Tx = Prisma.TransactionClient;

@Injectable()
export class AutoInyeccionCasosService {
  constructor(private readonly prisma: PrismaService) {}

  async importarCasos(dto: AutoInyeccionCasosDto) {
    if (!dto.casos?.length) {
      throw new BadRequestException(
        'La importación debe contener al menos un caso.',
      );
    }

    const contratosArchivo = new Set<string>();
    const placasArchivo = new Set<string>();
    const filas: Array<{
      fila: number;
      datos: AutoInyeccionCasoFilaDto;
    }> = [];

    for (const [indice, filaOriginal] of dto.casos.entries()) {
      const numeroFila = indice + 2;
      const fila = this.normalizarFila(filaOriginal);

      if (!fila.numeroContrato) {
        throw new BadRequestException(
          `La fila ${numeroFila} no tiene # CONTRATO.`,
        );
      }

      if (!fila.placa) {
        throw new BadRequestException(
          `La fila ${numeroFila} no tiene PLACA.`,
        );
      }

      if (!fila.nitLocatario) {
        throw new BadRequestException(
          `La fila ${numeroFila} no tiene NIT DEL LOCATARIO.`,
        );
      }

      if (contratosArchivo.has(fila.numeroContrato)) {
        throw new ConflictException(
          `El contrato ${fila.numeroContrato} está repetido en el archivo, fila ${numeroFila}.`,
        );
      }

      if (placasArchivo.has(fila.placa)) {
        throw new ConflictException(
          `La placa ${fila.placa} está repetida dentro del archivo, fila ${numeroFila}.`,
        );
      }

      contratosArchivo.add(fila.numeroContrato);
      placasArchivo.add(fila.placa);

      filas.push({
        fila: numeroFila,
        datos: fila,
      });
    }

    const resultado = await this.prisma.$transaction(async (tx) => {
      const actualizados: unknown[] = [];

      for (const item of filas) {
        const caso = await this.obtenerCaso(
          tx,
          item.datos.numeroContrato,
          item.fila,
        );

        const locatarioId = await this.actualizarLocatario(
          tx,
          item.datos,
          item.fila,
        );

        const propietarioId = await this.obtenerPropietarioId(
          tx,
          item.datos,
          item.fila,
        );

        const vehiculo = await this.actualizarVehiculo(
          tx,
          item.datos,
          propietarioId,
          item.fila,
        );

        const estadoContratoId = await this.buscarEstado(
          tx,
          item.datos.estadoContrato,
          'ESTADO_CONTRATO',
          item.fila,
          'ESTADO CONTRATO',
        );

        const estadoId = await this.buscarEstado(
          tx,
          item.datos.estado,
          'ESTADO_CASO',
          item.fila,
          'ESTADO',
        );

        const categoriaId = await this.buscarEstado(
          tx,
          item.datos.categoria,
          'CATEGORIA',
          item.fila,
          'CATEGORIA',
        );

        const etapaId = await this.buscarEstado(
          tx,
          item.datos.etapa,
          'ETAPA',
          item.fila,
          'ETAPA',
        );

        const subetapaId = await this.buscarEstado(
          tx,
          item.datos.subetapa,
          'SUBETAPA',
          item.fila,
          'SUBETAPA',
        );

        const casoActualizado = await tx.caso.update({
          where: { id: caso.id },
          data: {
            locatarioId,
            vehiculoPlaca: vehiculo.placa,

            ...this.valorOpcional(
              'radicadoBizagi',
              item.datos.radicadoBizagi,
            ),

            ...this.valorFecha(
              'fechaAsignacion',
              item.datos.fechaAsignacion,
            ),

            ...this.valorFecha(
              'fechaCierreTraspaso',
              item.datos.fechaCierreTraspaso,
            ),

            ...this.valorOpcional(
              'analistaResponsable',
              item.datos.analistaResponsable,
            ),

            ...this.valorBooleano(
              'aplicaInscripcionOpcionCompra',
              item.datos.aplicaInscripcionOpcionCompra,
            ),

            ...this.valorDecimal(
              'valorOpcionCompra',
              item.datos.valorOpcionCompra,
            ),

            ...(estadoContratoId !== undefined
              ? { estadoContratoId }
              : {}),

            ...(estadoId !== undefined
              ? { estadoId }
              : {}),

            ...(categoriaId !== undefined
              ? { categoriaId }
              : {}),

            ...(etapaId !== undefined
              ? { etapaId }
              : {}),

            ...(subetapaId !== undefined
              ? { subetapaId }
              : {}),

            ...this.valorOpcional(
              'ubicacionTarjeta',
              item.datos.ubicacionTarjeta,
            ),

            ...this.valorOpcional(
              'observacionesGestion',
              item.datos.observacionesGestion,
            ),
          },
        });

        await this.actualizarAuditoria(
          tx,
          caso.id,
          item.datos,
        );

        await this.actualizarProcesoJuridico(
          tx,
          caso.id,
          item.datos,
          item.fila,
        );

        actualizados.push(casoActualizado);
      }

      return {
        actualizados,
      };
    });

    return {
      total: dto.casos.length,
      creados: 0,
      actualizados: resultado.actualizados.length,
      rechazados: 0,
      casos: resultado.actualizados,
      errores: [],
    };
  }

  // ==========================================
  // OBTENER CASO
  // ==========================================

  private async obtenerCaso(
    tx: Tx,
    numeroContrato: string,
    fila: number,
  ) {
    const caso = await tx.caso.findUnique({
      where: {
        numeroContrato,
      },
      select: {
        id: true,
        numeroContrato: true,
        locatarioId: true,
        vehiculoPlaca: true,
      },
    });

    if (!caso) {
      throw new NotFoundException(
        `No existe el caso con contrato ${numeroContrato}, fila ${fila}.`,
      );
    }

    return caso;
  }

  // ==========================================
  // LOCATARIO
  // ==========================================

  private async actualizarLocatario(
    tx: Tx,
    fila: AutoInyeccionCasoFilaDto,
    numeroFila: number,
  ) {
    const nit = this.limpiar(fila.nitLocatario);

    if (!nit) {
      throw new BadRequestException(
        `La fila ${numeroFila} no tiene NIT DEL LOCATARIO.`,
      );
    }

    const locatario = await tx.locatario.findUnique({
      where: { nit },
    });

    if (!locatario) {
      throw new NotFoundException(
        `No existe un locatario con NIT ${nit}, fila ${numeroFila}.`,
      );
    }

    const data: Prisma.LocatarioUpdateInput = {};

    this.asignar(data, 'nombreBanco', fila.nombreLocatarioBanco);
    this.asignar(data, 'tipoDocumento', fila.tipoDocumento);
    this.asignar(data, 'email', fila.emailLocatario);
    this.asignar(data, 'contactoNombre', fila.nombreContactoLocatario);
    this.asignar(data, 'contactoNumero', fila.contactoLocatario);
    this.asignar(data, 'direccionEnvio', fila.direccionLocatario);
    this.asignar(data, 'nombreComercial', fila.nombreComercial);
    this.asignar(data, 'emailComercial', fila.emailComercial);
    this.asignar(data, 'locatarioRunt', fila.locatarioRunt);

    if (fila.revisionCorreo !== undefined) {
      data.revisionCorreo = fila.revisionCorreo;
    }

    if (fila.revisionMailComercial !== undefined) {
      data.revisionMailComercial = fila.revisionMailComercial;
    }

    if (!Object.keys(data).length) {
      return locatario.id;
    }

    const actualizado = await tx.locatario.update({
      where: { id: locatario.id },
      data,
    });

    return actualizado.id;
  }

  // ==========================================
  // PROPIETARIO
  // ==========================================

  private async obtenerPropietarioId(
    tx: Tx,
    fila: AutoInyeccionCasoFilaDto,
    numeroFila: number,
  ) {
    const identificacion = this.limpiar(
      fila.identificacionPropietario,
    );

    const nombre = this.limpiar(
      fila.nombrePropietario,
    );

    if (!identificacion && !nombre) {
      return undefined;
    }

    if (!identificacion && nombre) {
      throw new BadRequestException(
        `La fila ${numeroFila} tiene NOMBRE PROPIETARIO pero no # IDENTIFICACIÓN.`,
      );
    }

    const propietario = await tx.propietario.findUnique({
      where: { identificacion },
    });

    if (propietario) {
      if (nombre && nombre !== propietario.nombre) {
        await tx.propietario.update({
          where: { id: propietario.id },
          data: { nombre },
        });
      }

      return propietario.id;
    }

    if (!nombre) {
      throw new BadRequestException(
        `La fila ${numeroFila} requiere NOMBRE PROPIETARIO para crear el propietario.`,
      );
    }

    const nuevo = await tx.propietario.create({
      data: {
        identificacion,
        nombre,
      },
    });

    return nuevo.id;
  }

  // ==========================================
  // VEHICULO
  // ==========================================

  private async actualizarVehiculo(
    tx: Tx,
    fila: AutoInyeccionCasoFilaDto,
    propietarioId: number | undefined,
    numeroFila: number,
  ) {
    const placa = this.limpiar(fila.placa).toUpperCase();

    if (!placa) {
      throw new BadRequestException(
        `La fila ${numeroFila} no tiene PLACA.`,
      );
    }

    const estadoMatriculaId = await this.buscarEstado(
      tx,
      fila.estadoMatricula,
      'ESTADO_MATRICULA',
      numeroFila,
      'ESTADO DE MATRICULA',
    );

    const soatId = await this.buscarEstado(
      tx,
      fila.soat,
      'SOAT',
      numeroFila,
      'SOAT',
    );

    const revisionTecnomecanicaId = await this.buscarEstado(
      tx,
      fila.revisionTecnomecanica,
      'REVISION_TECNOMECANICA',
      numeroFila,
      'REVISION TECNOMECANICA',
    );

    const datos: Prisma.VehiculoUncheckedCreateInput = {
      placa,
    };

    this.asignar(datos, 'vin', fila.vin);
    this.asignar(datos, 'marca', fila.marca);
    this.asignar(datos, 'linea', fila.linea);
    this.asignar(datos, 'cilindraje', fila.cilindraje);
    this.asignar(datos, 'motor', fila.motor);
    this.asignar(datos, 'chasis', fila.chasis);
    this.asignar(datos, 'serie', fila.serie);
    this.asignar(datos, 'color', fila.color);
    this.asignar(datos, 'tipoVehiculo', fila.tipoVehiculo);
    this.asignar(datos, 'tipoServicio', fila.tipoServicio);
    this.asignar(datos, 'tipoCarroceria', fila.tipoCarroceria);
    this.asignar(datos, 'tipoCombustible', fila.tipoCombustible);
    this.asignar(datos, 'blindaje', fila.blindaje);
    this.asignar(datos, 'transito', fila.transito);
    this.asignar(datos, 'departamento', fila.departamento);
    this.asignar(datos, 'regional', fila.regional);
    this.asignar(
      datos,
      'empresaTransportadora',
      fila.empresaTransportadora,
    );

    if (fila.modelo !== undefined) {
      datos.modelo = fila.modelo;
    }

    if (estadoMatriculaId !== undefined) {
      datos.estadoMatriculaId = estadoMatriculaId;
    }

    if (soatId !== undefined) {
      datos.soatId = soatId;
    }

    if (revisionTecnomecanicaId !== undefined) {
      datos.revisionTecnomecanicaId =
        revisionTecnomecanicaId;
    }

    if (fila.vigenciaSoat) {
      datos.vigenciaSoat = this.convertirFecha(
        fila.vigenciaSoat,
        numeroFila,
      );
    }

    if (fila.vigenciaTecno) {
      datos.vigenciaTecno = this.convertirFecha(
        fila.vigenciaTecno,
        numeroFila,
      );
    }

    if (propietarioId !== undefined) {
      datos.propietarioId = propietarioId;
    }

    return tx.vehiculo.upsert({
      where: { placa },
      create: datos,
      update: this.quitarPlaca(datos),
    });
  }

  // ==========================================
  // AUDITORIA DE MULTAS
  // ==========================================

  private async actualizarAuditoria(
    tx: Tx,
    casoId: number,
    fila: AutoInyeccionCasoFilaDto,
  ) {
    const data: Prisma.AuditoriaMultaUncheckedCreateInput = {
      casoId,
    };

    let tieneDatos = false;

    const campos = [
      'limitacionesPropiedad',
      'tipoLimitaciones',
      'garantiasMobiliarias',
      'normalizacionSaneamiento',
      'simitMultasPropietarioResoluciones',
      'simitMultasLocatario',
      'multasPlaca',
      'impuestos',
      'vigenciasAdeudadas',
      'impuestosTransito',
    ] as const;

    for (const campo of campos) {
      const valor = fila[campo];

      if (
        valor !== undefined &&
        valor !== null &&
        valor !== ''
      ) {
        (data as Record<string, unknown>)[campo] = valor;
        tieneDatos = true;
      }
    }

    if (!tieneDatos) return;

    await tx.auditoriaMulta.upsert({
      where: { casoId },
      create: data,
      update: this.quitarCasoId(data),
    });
  }

  // ==========================================
  // PROCESO JURIDICO
  // ==========================================

  private async actualizarProcesoJuridico(
    tx: Tx,
    casoId: number,
    fila: AutoInyeccionCasoFilaDto,
    numeroFila: number,
  ) {
    const tipoSaneamientoARealizarId =
      await this.buscarEstado(
        tx,
        fila.tipoSaneamientoARealizar,
        'TIPO_SANEAMIENTO',
        numeroFila,
        'TIPO DE TRASPASO A REALIZAR',
      );

    if (tipoSaneamientoARealizarId === undefined) {
      return;
    }

    await tx.procesoJuridico.upsert({
      where: { casoId },
      create: {
        casoId,
        tipoSaneamientoARealizarId,
      },
      update: {
        tipoSaneamientoARealizarId,
      },
    });
  }

  // ==========================================
  // BUSQUEDA DE ESTADOS
  // ==========================================

  private async buscarEstado(
    tx: Tx,
    valor: string | undefined,
    tipo: string,
    numeroFila: number,
    campo: string,
  ) {
    const nombre = this.limpiar(valor);

    if (!nombre) return undefined;

    const estados = await tx.estado.findMany({
      where: {
        tipo: {
          equals: tipo,
          mode: 'insensitive',
        },
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
        activo: true,
      },
    });

    if (!estados.length) {
      throw new BadRequestException(
        `No existe ${campo} "${nombre}" en el catálogo ${tipo}, fila ${numeroFila}.`,
      );
    }

    if (estados.length > 1) {
      throw new ConflictException(
        `Existe más de un ${campo} "${nombre}" en el catálogo ${tipo}, fila ${numeroFila}.`,
      );
    }

    return estados[0].id;
  }

  // ==========================================
  // NORMALIZACION
  // ==========================================

  private normalizarFila(
    fila: AutoInyeccionCasoFilaDto,
  ): AutoInyeccionCasoFilaDto {
    return {
      ...fila,

      numeroContrato: this.limpiar(
        fila.numeroContrato,
      ),

      radicadoBizagi: this.opcional(
        fila.radicadoBizagi,
      ),

      placa: this.limpiar(
        fila.placa,
      ).toUpperCase(),

      nitLocatario: this.limpiar(
        fila.nitLocatario,
      ),

      identificacionPropietario:
        this.opcional(
          fila.identificacionPropietario,
        ),

      nombrePropietario:
        this.opcional(
          fila.nombrePropietario,
        ),

      estadoContrato:
        this.opcional(fila.estadoContrato),

      estado:
        this.opcional(fila.estado),

      categoria:
        this.opcional(fila.categoria),

      etapa:
        this.opcional(fila.etapa),

      subetapa:
        this.opcional(fila.subetapa),

      estadoMatricula:
        this.opcional(fila.estadoMatricula),

      soat:
        this.opcional(fila.soat),

      revisionTecnomecanica:
        this.opcional(
          fila.revisionTecnomecanica,
        ),

      tipoSaneamientoARealizar:
        this.opcional(
          fila.tipoSaneamientoARealizar,
        ),
    };
  }

  // ==========================================
  // HELPERS
  // ==========================================

  private asignar(
    objeto: Record<string, unknown>,
    campo: string,
    valor: unknown,
  ) {
    if (
      valor !== undefined &&
      valor !== null &&
      valor !== ''
    ) {
      objeto[campo] = valor;
    }
  }

  private valorOpcional(
    campo: string,
    valor?: string,
  ): Record<string, unknown> {
    return valor !== undefined &&
      valor !== ''
      ? { [campo]: valor }
      : {};
  }

  private valorBooleano(
    campo: string,
    valor?: boolean,
  ): Record<string, unknown> {
    return valor !== undefined
      ? { [campo]: valor }
      : {};
  }

  private valorDecimal(
    campo: string,
    valor?: number,
  ): Record<string, unknown> {
    return valor !== undefined
      ? {
          [campo]: new Prisma.Decimal(valor),
        }
      : {};
  }

  private valorFecha(
    campo: string,
    valor?: string,
  ): Record<string, unknown> {
    return valor
      ? {
          [campo]: this.convertirFecha(
            valor,
            0,
          ),
        }
      : {};
  }

  private convertirFecha(
    valor: string,
    numeroFila: number,
  ) {
    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) {
      throw new BadRequestException(
        `Fecha inválida "${valor}"${
          numeroFila
            ? `, fila ${numeroFila}`
            : ''
        }.`,
      );
    }

    return fecha;
  }

  private quitarPlaca(
    datos: Prisma.VehiculoUncheckedCreateInput,
  ) {
    const { placa, ...resto } = datos;
    return resto;
  }

  private quitarCasoId(
    datos: Prisma.AuditoriaMultaUncheckedCreateInput,
  ) {
    const { casoId, ...resto } = datos;
    return resto;
  }

  private limpiar(
    valor?: string | null,
  ) {
    return typeof valor === 'string'
      ? valor.trim()
      : '';
  }

  private opcional(
    valor?: string | null,
  ) {
    const limpio = this.limpiar(valor);
    return limpio || undefined;
  }
}