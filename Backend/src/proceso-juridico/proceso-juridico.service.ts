import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProcesoJuridicoDto } from './dto/create-proceso-juridico.dto';
import { UpdateProcesoJuridicoDto } from './dto/update-proceso-juridico.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProcesoJuridicoService {
  constructor(private readonly prisma: PrismaService) {}

  private convertirFechas<T extends object>(datos: T): T {
    const camposFecha = [
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

        const fecha = /^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)
          ? new Date(`${fechaTexto}T00:00:00.000Z`)
          : new Date(fechaTexto);

        resultado[campo] = isNaN(fecha.getTime()) ? null : fecha;
      }
    }

    return resultado as T;
  }

  async create(createProcesoJuridicoDto: CreateProcesoJuridicoDto) {
    const casoExiste = await this.prisma.caso.findUnique({
      where: { id: createProcesoJuridicoDto.casoId },
    });

    if (!casoExiste) {
      throw new NotFoundException(
        `No existe un caso con el ID ${createProcesoJuridicoDto.casoId}`,
      );
    }

    const datos = this.convertirFechas(createProcesoJuridicoDto);

    return this.prisma.procesoJuridico.create({
      data: datos as Prisma.ProcesoJuridicoUncheckedCreateInput,
      include: {
        caso: true,
      },
    });
  }

  findAll() {
    return this.prisma.procesoJuridico.findMany({
      include: {
        caso: true,
      },
    });
  }

  async findOne(id: number) {
    const proceso = await this.prisma.procesoJuridico.findUnique({
      where: { id },
      include: {
        caso: true,
      },
    });

    if (!proceso) {
      throw new NotFoundException(
        `Proceso jurídico con ID ${id} no encontrado`,
      );
    }

    return proceso;
  }

  async findByCasoId(casoId: number) {
    return this.prisma.procesoJuridico.findMany({
      where: { casoId },
      include: {
        caso: true,
      },
    });
  }

  async update(
    id: number,
    updateProcesoJuridicoDto: UpdateProcesoJuridicoDto,
  ) {
    await this.findOne(id);

    const datos = this.convertirFechas(updateProcesoJuridicoDto);

    return this.prisma.procesoJuridico.update({
      where: { id },
      data: datos as Prisma.ProcesoJuridicoUncheckedUpdateInput,
      include: {
        caso: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.procesoJuridico.delete({
      where: { id },
    });
  }
}