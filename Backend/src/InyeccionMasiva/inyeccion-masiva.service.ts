import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ImportarVehiculoFilaDto,
  ImportarVehiculosDto,
} from './importar-vehiculos.dto';

interface FilaValida {
  fila: number;
  datos: ImportarVehiculoFilaDto;
}

type VehiculoResultado = Prisma.VehiculoGetPayload<{}>;
type Tx = Prisma.TransactionClient;
type VehiculoDatos = Omit<Prisma.VehiculoUncheckedCreateInput, 'placa'>;
type AuditoriaDatos = Pick<Prisma.AuditoriaMultaUncheckedCreateInput, 'limitacionesPropiedad' | 'garantiasMobiliarias'>;

@Injectable()
export class InyeccionMasivaService {
  constructor(private readonly prisma: PrismaService) {}

  async importarVehiculos(dto: ImportarVehiculosDto) {
    if (!dto.vehiculos?.length) {
      throw new BadRequestException('La importación debe contener al menos un vehículo.');
    }

    const placasArchivo = new Set<string>();
    const filasValidas: FilaValida[] = [];

    for (const [indice, fila] of dto.vehiculos.entries()) {
      const numeroCaso = this.opcional(fila.numeroCaso);
      const radicadoBizagi = this.opcional(fila.radicadoBizagi);
      const documentoLocatario = this.opcional(fila.numeroIdentificacionLocatario);
      const placa = this.limpiar(fila.placa).toUpperCase();
      const numeroFila = indice + 2;

      if (!placa) {
        throw new BadRequestException(`La fila ${numeroFila} no tiene PLACA.`);
      }

      if (!numeroCaso && !radicadoBizagi && !documentoLocatario) {
        throw new BadRequestException(
          `La fila ${numeroFila} debe tener NumeroCaso, RadicadoBizagi o NumeroIdentificacionLocatario.`,
        );
      }

      if (placasArchivo.has(placa)) {
        throw new ConflictException(`La placa ${placa} está repetida dentro del archivo, fila ${numeroFila}.`);
      }

      placasArchivo.add(placa);
      await this.validarCaso({ numeroCaso, radicadoBizagi, documentoLocatario, fila: numeroFila });
      filasValidas.push({ fila: numeroFila, datos: { ...fila, placa } });
    }

    const resultado = await this.prisma.$transaction(async (tx) => {
      const creados: VehiculoResultado[] = [];
      const actualizados: VehiculoResultado[] = [];

      for (const item of filasValidas) {
        const datos = this.normalizarFila(item.datos);
        const caso = await this.obtenerCaso(tx, datos, item.fila);
        const estadoMatriculaId = await this.obtenerEstadoMatriculaId(tx, datos.estadoMatricula, datos.estadoMatriculaId, item.fila);

        await this.actualizarLocatario(tx, caso.locatarioId, datos);
        const propietarioId = await this.obtenerPropietarioId(tx, datos, item.fila);

        const existente = await tx.vehiculo.findUnique({ where: { placa: datos.placa } });
        const datosVehiculo = this.convertirDatosVehiculo(datos, estadoMatriculaId, propietarioId, Boolean(existente));

        const vehiculo = existente
          ? await tx.vehiculo.update({ where: { placa: datos.placa }, data: datosVehiculo })
          : await tx.vehiculo.create({ data: { placa: datos.placa, ...datosVehiculo } });

        if (existente) actualizados.push(vehiculo);
        else creados.push(vehiculo);

        await this.actualizarAuditoria(tx, caso.id, datos);
      }

      return { creados, actualizados };
    });

    return {
      total: dto.vehiculos.length,
      creados: resultado.creados.length,
      actualizados: resultado.actualizados.length,
      rechazados: 0,
      vehiculos: [...resultado.creados, ...resultado.actualizados],
      errores: [],
    };
  }

  private async obtenerCaso(tx: Tx, fila: ReturnType<InyeccionMasivaService['normalizarFila']>, numeroFila: number) {
    const candidatos: number[] = [];

    if (fila.numeroCaso) {
      const caso = await tx.caso.findUnique({ where: { numeroContrato: fila.numeroCaso }, select: { id: true, locatarioId: true, vehiculoPlaca: true } });
      if (caso) candidatos.push(caso.id);
    }

    if (fila.radicadoBizagi) {
      const casos = await tx.caso.findMany({ where: { radicadoBizagi: fila.radicadoBizagi }, select: { id: true, locatarioId: true, vehiculoPlaca: true } });
      if (casos.length > 1) throw new ConflictException(`El RadicadoBizagi ${fila.radicadoBizagi} está repetido en la base de datos, fila ${numeroFila}.`);
      if (casos[0]) candidatos.push(casos[0].id);
    }

    if (fila.numeroIdentificacionLocatario) {
      const casos = await tx.caso.findMany({ where: { locatario: { nit: fila.numeroIdentificacionLocatario } }, select: { id: true, locatarioId: true, vehiculoPlaca: true } });
      if (casos.length === 1) candidatos.push(casos[0].id);
      else if (casos.length > 1) throw new ConflictException(`El locatario ${fila.numeroIdentificacionLocatario} tiene varios casos; se necesita NumeroCaso o RadicadoBizagi, fila ${numeroFila}.`);
    }

    const ids = [...new Set(candidatos)];
    if (!ids.length) throw new NotFoundException(`No se encontró un caso con las claves suministradas, fila ${numeroFila}.`);
    if (ids.length > 1) throw new ConflictException(`Las claves de la fila ${numeroFila} no corresponden al mismo caso.`);

    const caso = await tx.caso.findUnique({ where: { id: ids[0] }, select: { id: true, locatarioId: true, vehiculoPlaca: true } });
    if (!caso) throw new NotFoundException(`Caso no encontrado, fila ${numeroFila}.`);
    if (caso.vehiculoPlaca && caso.vehiculoPlaca !== fila.placa) {
      throw new ConflictException(`La placa ${fila.placa} no corresponde al caso de la fila ${numeroFila}.`);
    }
    return caso;
  }

  private async validarCaso(datos: { numeroCaso?: string; radicadoBizagi?: string; documentoLocatario?: string; fila: number }) {
    if (!datos.numeroCaso && !datos.radicadoBizagi && !datos.documentoLocatario) return;
    const candidatos: number[] = [];
    if (datos.numeroCaso) {
      const caso = await this.prisma.caso.findUnique({ where: { numeroContrato: datos.numeroCaso }, select: { id: true } });
      if (caso) candidatos.push(caso.id);
    }
    if (datos.radicadoBizagi) {
      const casos = await this.prisma.caso.findMany({ where: { radicadoBizagi: datos.radicadoBizagi }, select: { id: true } });
      if (casos.length > 1) throw new ConflictException(`El RadicadoBizagi ${datos.radicadoBizagi} está repetido en la base de datos, fila ${datos.fila}.`);
      if (casos[0]) candidatos.push(casos[0].id);
    }
    if (datos.documentoLocatario) {
      const casos = await this.prisma.caso.findMany({ where: { locatario: { nit: datos.documentoLocatario } }, select: { id: true } });
      if (casos.length === 1) candidatos.push(casos[0].id);
      else if (casos.length > 1) throw new ConflictException(`El locatario ${datos.documentoLocatario} tiene varios casos; fila ${datos.fila}.`);
    }
    const ids = [...new Set(candidatos)];
    if (!ids.length) throw new NotFoundException(`No se encontró un caso con las claves suministradas, fila ${datos.fila}.`);
    if (ids.length > 1) throw new ConflictException(`Las claves no corresponden al mismo caso, fila ${datos.fila}.`);
  }

  private normalizarFila(fila: ImportarVehiculoFilaDto) {
    return {
      ...fila,
      placa: this.limpiar(fila.placa).toUpperCase(),
      numeroCaso: this.opcional(fila.numeroCaso),
      radicadoBizagi: this.opcional(fila.radicadoBizagi),
      numeroIdentificacionLocatario: this.opcional(fila.numeroIdentificacionLocatario),
      locatarioRunt: this.opcional(fila.locatarioRunt),
      identificacionPropietario: this.opcional(fila.identificacionPropietario),
      nombrePropietario: this.opcional(fila.nombrePropietario),
      estadoMatricula: this.opcional(fila.estadoMatricula)?.toUpperCase(),
      blindaje: this.convertirBlindaje(fila.blindaje),
      limitacionesPropiedad: this.convertirSiNo(fila.limitacionesPropiedad),
      garantiasMobiliarias: this.opcional(fila.garantiasMobiliarias),
    };
  }

  private convertirDatosVehiculo(
    fila: ReturnType<InyeccionMasivaService['normalizarFila']>,
    estadoMatriculaId?: number,
    propietarioId?: number,
    existente = false,
  ): VehiculoDatos {
    const datos: VehiculoDatos = {};
    const asignar = (campo: string, valor: unknown) => {
      if (valor !== undefined && valor !== null && valor !== '') (datos as Record<string, unknown>)[campo] = valor;
    };

    const filaComoRegistro = fila as unknown as Record<string, unknown>;
    for (const campo of ['vin', 'marca', 'linea', 'cilindraje', 'motor', 'chasis', 'serie', 'color', 'tipoVehiculo', 'tipoServicio', 'tipoCarroceria', 'tipoCombustible', 'transito', 'departamento', 'regional', 'empresaTransportadora']) {
      const valor = filaComoRegistro[campo];
      asignar(campo, typeof valor === 'string' ? this.opcional(valor) : valor);
    }
    asignar('modelo', fila.modelo);
    asignar('blindaje', fila.blindaje);
    if (estadoMatriculaId !== undefined) asignar('estadoMatriculaId', estadoMatriculaId);
    if (fila.vigenciaSoat) asignar('vigenciaSoat', this.convertirFecha(fila.vigenciaSoat));
    if (fila.vigenciaTecno) asignar('vigenciaTecno', this.convertirFecha(fila.vigenciaTecno));
    if (!existente && Object.keys(datos).length === 0) return {};
    return datos;
  }

  private async actualizarLocatario(tx: Tx, locatarioId: number, fila: ReturnType<InyeccionMasivaService['normalizarFila']>) {
    if (!fila.locatarioRunt) return;
    await tx.locatario.update({ where: { id: locatarioId }, data: { locatarioRunt: fila.locatarioRunt } });
  }

  private async obtenerPropietarioId(tx: Tx, fila: ReturnType<InyeccionMasivaService['normalizarFila']>, numeroFila: number) {
    if (!fila.identificacionPropietario) {
      if (fila.nombrePropietario) throw new BadRequestException(`La fila ${numeroFila} tiene Nombre Propietario pero no Identificacion Propietario.`);
      return undefined;
    }

    const propietario = await tx.propietario.findUnique({ where: { identificacion: fila.identificacionPropietario } });
    if (propietario) {
      if (fila.nombrePropietario && fila.nombrePropietario !== propietario.nombre) {
        await tx.propietario.update({ where: { id: propietario.id }, data: { nombre: fila.nombrePropietario } });
      }
      return propietario.id;
    }
    if (!fila.nombrePropietario) throw new BadRequestException(`La fila ${numeroFila} requiere Nombre Propietario para crear el propietario.`);
    const nuevo = await tx.propietario.create({ data: { identificacion: fila.identificacionPropietario, nombre: fila.nombrePropietario } });
    return nuevo.id;
  }

  private async actualizarAuditoria(tx: Tx, casoId: number, fila: ReturnType<InyeccionMasivaService['normalizarFila']>) {
    const data: AuditoriaDatos = {};
    if (fila.limitacionesPropiedad) data.limitacionesPropiedad = fila.limitacionesPropiedad;
    if (fila.garantiasMobiliarias) data.garantiasMobiliarias = fila.garantiasMobiliarias;
    if (!Object.keys(data).length) return;

    await tx.auditoriaMulta.upsert({
      where: { casoId },
      create: { casoId, ...data },
      update: data,
    });
  }

  private async obtenerEstadoMatriculaId(tx: Tx, valor: string | undefined, id: number | undefined, numeroFila: number) {
    if (id !== undefined) return id;
    if (!valor) return undefined;
    const valorNormalizado = valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    const nombre = valorNormalizado === 'AC' || valorNormalizado === 'ACTIVA'
      ? 'Activa'
      : valorNormalizado === 'CANCELADA'
        ? 'Cancelada'
        : valor;
    const estado = await tx.estado.findFirst({
      where: {
        tipo: { equals: 'ESTADO_MATRICULA', mode: 'insensitive' },
        nombre: { equals: nombre, mode: 'insensitive' },
      },
    });
    if (!estado) throw new BadRequestException(`No existe el estado de matrícula ${valor}, fila ${numeroFila}.`);
    return estado.id;
  }

  private convertirBlindaje(valor?: string) {
    const limpio = this.opcional(valor);
    if (!limpio) return undefined;
    const nivel = Number(limpio.replace(/[^0-9.,-]/g, '').replace(',', '.'));
    if (Number.isFinite(nivel)) return nivel >= 3 ? 'BLINDADO' : 'NO BLINDADO';
    const normalizado = limpio.toUpperCase();
    if (normalizado.includes('NO')) return 'NO BLINDADO';
    if (normalizado.includes('SI') || normalizado.includes('BLIND')) return 'BLINDADO';
    throw new BadRequestException(`Nivel de blindaje inválido: ${valor}.`);
  }

  private convertirSiNo(valor?: string) {
    const limpio = this.opcional(valor)?.toUpperCase();
    if (!limpio) return undefined;
    if (['SI', 'SÍ', 'YES', 'A'].includes(limpio)) return 'SI';
    if (['NO', 'N', 'V'].includes(limpio)) return 'NO';
    throw new BadRequestException(`El valor ${valor} debe ser SI o NO.`);
  }

  private convertirFecha(valor?: string | null) {
    const limpio = this.limpiar(valor);
    if (!limpio) return undefined;
    const fecha = new Date(limpio);
    if (Number.isNaN(fecha.getTime())) throw new BadRequestException(`Fecha inválida: ${limpio}`);
    return fecha;
  }

  private limpiar(valor?: string | null) {
    return typeof valor === 'string' ? valor.trim() : '';
  }

  private opcional(valor?: string | null) {
    const limpio = this.limpiar(valor);
    return limpio || undefined;
  }
}
