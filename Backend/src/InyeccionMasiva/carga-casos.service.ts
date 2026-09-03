import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ImportarCasoFilaDto,
  ImportarCasosDto,
  ResultadoImportacionCasos,
  ResultadoFilaImportacionCaso,
} from './importar-casos.dto';

@Injectable()
export class CargaCasosService {
  constructor(private readonly prisma: PrismaService) {}

  async importarCasos(dto: ImportarCasosDto): Promise<ResultadoImportacionCasos> {
    if (!dto.casos?.length) {
      throw new BadRequestException('La importación debe contener al menos un caso.');
    }

    const contratos = new Set<string>();
    const radicados = new Set<string>();
    const placas = new Set<string>();
    const resultados: ResultadoFilaImportacionCaso[] = [];

    for (const [indice, fila] of dto.casos.entries()) {
      const numeroFila = indice + 1;
      const datos = this.normalizarFila(fila);

      this.validarFila(datos, numeroFila, contratos, radicados, placas);
      contratos.add(datos.numeroContrato);
      radicados.add(datos.radicadoBizagi);
      placas.add(datos.placa);

      const resultado = await this.prisma.$transaction(async (tx) => {
        const estadoContratoId = await this.obtenerEstadoContratoId(tx, datos.contratoVigente, numeroFila);

        const locatario = await tx.locatario.findUnique({
          where: { nit: datos.nitLocatario },
        });

        const datosLocatario: Prisma.LocatarioUpdateInput = {};
        if (datos.nombreLocatarioBanco) datosLocatario.nombreBanco = datos.nombreLocatarioBanco;
        if (datos.tipoDocumento) datosLocatario.tipoDocumento = datos.tipoDocumento;
        if (datos.emailLocatario) datosLocatario.email = datos.emailLocatario;

        const locatarioGuardado = locatario
          ? Object.keys(datosLocatario).length > 0
            ? await tx.locatario.update({ where: { id: locatario.id }, data: datosLocatario })
            : locatario
          : await tx.locatario.create({
              data: {
                nit: datos.nitLocatario,
                nombreBanco: datos.nombreLocatarioBanco,
                tipoDocumento: datos.tipoDocumento,
                email: datos.emailLocatario,
              },
            });

        const vehiculo = await tx.vehiculo.findUnique({ where: { placa: datos.placa } });
        if (!vehiculo) {
          await tx.vehiculo.create({ data: { placa: datos.placa } });
        }

        const casoExistente = await tx.caso.findUnique({
          where: { numeroContrato: datos.numeroContrato },
          select: { id: true, radicadoBizagi: true, vehiculoPlaca: true },
        });

        if (casoExistente) {
          const conflictoRadicado = casoExistente.radicadoBizagi && casoExistente.radicadoBizagi !== datos.radicadoBizagi;
          const conflictoPlaca = casoExistente.vehiculoPlaca !== datos.placa;
          if (conflictoRadicado || conflictoPlaca) {
            throw new ConflictException(`La fila ${numeroFila} no coincide con el caso existente para el contrato ${datos.numeroContrato}.`);
          }

          const otroCaso = await tx.caso.findFirst({
            where: {
              radicadoBizagi: datos.radicadoBizagi,
              NOT: { id: casoExistente.id },
            },
            select: { numeroContrato: true },
          });
          if (otroCaso) {
            throw new ConflictException(`El Radicado Bizagi ${datos.radicadoBizagi} ya pertenece al contrato ${otroCaso.numeroContrato}.`);
          }

          const datosCaso: Prisma.CasoUncheckedUpdateInput = {
            radicadoBizagi: datos.radicadoBizagi,
            locatarioId: locatarioGuardado.id,
            vehiculoPlaca: datos.placa,
          };
          if (datos.fechaAsignacion) datosCaso.fechaAsignacion = new Date(datos.fechaAsignacion);
          if (datos.valorOpcionCompra !== undefined) datosCaso.valorOpcionCompra = datos.valorOpcionCompra;
          if (estadoContratoId !== undefined) datosCaso.estadoContratoId = estadoContratoId;

          await tx.caso.update({ where: { id: casoExistente.id }, data: datosCaso });
          return { fila: numeroFila, operacion: 'ACTUALIZADO' as const };
        }

        const casoConRadicado = await tx.caso.findFirst({
          where: { radicadoBizagi: datos.radicadoBizagi },
          select: { numeroContrato: true },
        });
        if (casoConRadicado) {
          throw new ConflictException(`El Radicado Bizagi ${datos.radicadoBizagi} ya pertenece al contrato ${casoConRadicado.numeroContrato}.`);
        }

        await tx.caso.create({
          data: {
            numeroContrato: datos.numeroContrato,
            radicadoBizagi: datos.radicadoBizagi,
            fechaAsignacion: datos.fechaAsignacion ? new Date(datos.fechaAsignacion) : undefined,
            valorOpcionCompra: datos.valorOpcionCompra,
            estadoContratoId,
            locatarioId: locatarioGuardado.id,
            vehiculoPlaca: datos.placa,
          },
        });
        return { fila: numeroFila, operacion: 'CREADO' as const };
      });

      resultados.push({
        ...resultado,
        numeroContrato: datos.numeroContrato,
        radicadoBizagi: datos.radicadoBizagi,
        placa: datos.placa,
        nitLocatario: datos.nitLocatario,
      });
    }

    const creados = resultados.filter((item) => item.operacion === 'CREADO').length;
    return {
      total: dto.casos.length,
      creados,
      actualizados: resultados.length - creados,
      rechazados: 0,
      errores: [],
      casos: resultados,
    };
  }

  private normalizarFila(fila: ImportarCasoFilaDto) {
    return {
      ...fila,
      radicadoBizagi: this.limpiar(fila.radicadoBizagi),
      numeroContrato: this.limpiar(fila.numeroContrato),
      placa: this.limpiar(fila.placa).toUpperCase(),
      nitLocatario: this.limpiar(fila.nitLocatario),
      contratoVigente: this.limpiar(fila.contratoVigente).toUpperCase() || undefined,
      nombreLocatarioBanco: this.opcional(fila.nombreLocatarioBanco),
      tipoDocumento: this.opcional(fila.tipoDocumento),
      emailLocatario: this.opcional(fila.emailLocatario)?.toLowerCase(),
    };
  }

  private validarFila(
    fila: ReturnType<CargaCasosService['normalizarFila']>,
    numeroFila: number,
    contratos: Set<string>,
    radicados: Set<string>,
    placas: Set<string>,
  ) {
    if (!fila.radicadoBizagi || !fila.numeroContrato || !fila.placa || !fila.nitLocatario) {
      throw new BadRequestException(`La fila ${numeroFila} requiere Radicado Bizagi, Número de Contrato, Placa y NIT del Locatario.`);
    }
    if (contratos.has(fila.numeroContrato)) throw new ConflictException(`El contrato ${fila.numeroContrato} se repite en el archivo, fila ${numeroFila}.`);
    if (radicados.has(fila.radicadoBizagi)) throw new ConflictException(`El Radicado Bizagi ${fila.radicadoBizagi} se repite en el archivo, fila ${numeroFila}.`);
    if (placas.has(fila.placa)) throw new ConflictException(`La placa ${fila.placa} se repite en el archivo, fila ${numeroFila}.`);
    if (fila.contratoVigente && !['CONTRATO VIGENTE', 'CONTRATO VENCIDO'].includes(fila.contratoVigente)) {
      throw new BadRequestException(`Contrato Vigente inválido en la fila ${numeroFila}. Use CONTRATO VIGENTE o CONTRATO VENCIDO.`);
    }
  }

  private async obtenerEstadoContratoId(
    tx: Prisma.TransactionClient,
    valor: string | undefined,
    numeroFila: number,
  ) {
    if (!valor) return undefined;
    const estado = await tx.estado.findFirst({ where: { tipo: 'ESTADO_CONTRATO', nombre: valor } });
    if (!estado) throw new BadRequestException(`No existe el estado de contrato ${valor}, fila ${numeroFila}.`);
    return estado.id;
  }

  private limpiar(valor?: string | null) {
    return typeof valor === 'string' ? valor.trim() : '';
  }

  private opcional(valor?: string | null) {
    const limpio = this.limpiar(valor);
    return limpio || undefined;
  }
}
