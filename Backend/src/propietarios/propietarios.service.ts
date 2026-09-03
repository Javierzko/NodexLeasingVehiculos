import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';

@Injectable()
export class PropietariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPropietarioDto: CreatePropietarioDto) {
    const existe = await this.prisma.propietario.findUnique({
      where: { identificacion: createPropietarioDto.identificacion },
    });

    if (existe) {
      throw new ConflictException(
        `Ya existe un propietario con la identificación ${createPropietarioDto.identificacion}`,
      );
    }

    return this.prisma.propietario.create({
      data: createPropietarioDto,
    });
  }

  findAll() {
    return this.prisma.propietario.findMany({
      include: {
        vehiculos: true, // Incluye la lista de vehículos a su nombre
      },
    });
  }

  async findOne(id: number) {
    const propietario = await this.prisma.propietario.findUnique({
      where: { id },
      include: { vehiculos: true },
    });

    if (!propietario) {
      throw new NotFoundException(`Propietario con ID ${id} no encontrado`);
    }

    return propietario;
  }

  async findByIdentificacion(identificacion: string) {
    const propietario = await this.prisma.propietario.findUnique({
      where: { identificacion },
      include: { vehiculos: true },
    });

    if (!propietario) {
      throw new NotFoundException(
        `Propietario con identificación ${identificacion} no encontrado`,
      );
    }

    return propietario;
  }

  async update(id: number, updatePropietarioDto: UpdatePropietarioDto) {
    await this.findOne(id);

    return this.prisma.propietario.update({
      where: { id },
      data: updatePropietarioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.propietario.delete({
      where: { id },
    });
  }
}