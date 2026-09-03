import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditoriaMultaDto } from './dto/create-auditoria-multa.dto';
import { UpdateAuditoriaMultaDto } from './dto/update-auditoria-multa.dto';

@Injectable()
export class AuditoriaMultasService {
  constructor(private readonly prisma: PrismaService) {}

  private convertirFechas<T extends object>(datos: T): T {
    const camposFecha = [
      'fechaInfraccion',
    ];

    const resultado: any = { ...datos };

    for (const campo of camposFecha) {
      const valor = resultado[campo];

      if (typeof valor === 'string' && valor.trim() !== '') {
        resultado[campo] = new Date(`${valor}T00:00:00.000Z`);
      }
    }

    return resultado as T;
  }

  async create(createDto: CreateAuditoriaMultaDto) {
    const casoExiste = await this.prisma.caso.findUnique({
      where: { id: createDto.casoId },
    });

    if (!casoExiste) {
      throw new NotFoundException(
        `No existe un caso con el ID ${createDto.casoId}`,
      );
    }

    const datos = this.convertirFechas(createDto);

    return this.prisma.auditoriaMulta.create({
      data: datos,
      include: {
        caso: true,
      },
    });
  }

  findAll() {
    return this.prisma.auditoriaMulta.findMany({
      include: {
        caso: true,
      },
    });
  }

  async findOne(id: number) {
    const auditoria = await this.prisma.auditoriaMulta.findUnique({
      where: { id },
      include: {
        caso: true,
      },
    });

    if (!auditoria) {
      throw new NotFoundException(
        `Auditoría de multa con ID "${id}" no encontrada`,
      );
    }

    return auditoria;
  }

  async findByCasoId(casoId: number) {
    return this.prisma.auditoriaMulta.findMany({
      where: { casoId },
      include: {
        caso: true,
      },
    });
  }

  async update(
    id: number,
    updateDto: UpdateAuditoriaMultaDto,
  ) {
    await this.findOne(id);

    const datos = this.convertirFechas(updateDto);

    return this.prisma.auditoriaMulta.update({
      where: { id },
      data: datos,
      include: {
        caso: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.auditoriaMulta.delete({
      where: { id },
    });
  }
}