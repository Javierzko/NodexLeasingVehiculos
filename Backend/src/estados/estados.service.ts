import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class EstadosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEstadoDto: CreateEstadoDto) {
    return this.prisma.estado.create({
      data: createEstadoDto,
    });
  }

  async findAll(tipo?: string) {
    return this.prisma.estado.findMany({
      where: {
        ...(tipo ? { tipo } : {}),
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const estado = await this.prisma.estado.findUnique({
      where: { id },
    });

    if (!estado) {
      throw new NotFoundException(`Estado con ID ${id} no encontrado`);
    }

    return estado;
  }

  async update(id: number, updateEstadoDto: UpdateEstadoDto) {
    await this.findOne(id);

    return this.prisma.estado.update({
      where: { id },
      data: updateEstadoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.estado.update({
      where: { id },
      data: { activo: false },
    });
  }
}