// src/vehiculos/vehiculos.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class VehiculosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVehiculoDto: CreateVehiculoDto) {
    const existe = await this.prisma.vehiculo.findUnique({
      where: { placa: createVehiculoDto.placa },
    });

    if (existe) {
      throw new ConflictException(
        `El vehículo con placa ${createVehiculoDto.placa} ya está registrado.`,
      );
    }

    return this.prisma.vehiculo.create({
      data: createVehiculoDto as Prisma.VehiculoUncheckedCreateInput,
    });
  }

  findAll() {
    return this.prisma.vehiculo.findMany({
      include: {
        propietario: true,
        casos: true,
        soat: true,
        revisionTecnomecanica: true,
        estadoMatricula: true,
      },
    });
  }

  async findOne(placa: string) {
    const vehiculo = await this.prisma.vehiculo.findUnique({
      where: { placa },
      include: {
        propietario: true,
        casos: true,
        soat: true,
        revisionTecnomecanica: true,
        estadoMatricula: true,
      },
    });

    if (!vehiculo) {
      throw new NotFoundException(
        `Vehículo con placa ${placa} no encontrado.`,
      );
    }

    return vehiculo;
  }

  async update(placa: string, updateVehiculoDto: UpdateVehiculoDto) {
    await this.findOne(placa);

    return this.prisma.vehiculo.update({
      where: { placa },
      data: updateVehiculoDto as Prisma.VehiculoUncheckedUpdateInput,
      include: {
        propietario: true,
        casos: true,
        soat: true,
        revisionTecnomecanica: true,
        estadoMatricula: true,
      },
    });
  }

  async remove(placa: string) {
    await this.findOne(placa);

    return this.prisma.vehiculo.delete({
      where: { placa },
    });
  }
}