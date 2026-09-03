import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocatarioDto } from './dto/create-locatario.dto';
import { UpdateLocatarioDto } from './dto/update-locatario.dto';

@Injectable()
export class LocatariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLocatarioDto: CreateLocatarioDto) {
    const existe = await this.prisma.locatario.findUnique({
      where: { nit: createLocatarioDto.nit },
    });

    if (existe) {
      throw new ConflictException(`Ya existe un locatario con el NIT ${createLocatarioDto.nit}`);
    }

    return this.prisma.locatario.create({
      data: createLocatarioDto,
    });
  }

  findAll() {
    return this.prisma.locatario.findMany({
      include: {
        casos: true,
      },
    });
  }

  async findOne(id: number) {
    const locatario = await this.prisma.locatario.findUnique({
      where: { id },
      include: { casos: true },
    });

    if (!locatario) {
      throw new NotFoundException(`Locatario con ID ${id} no encontrado`);
    }

    return locatario;
  }

  async update(id: number, updateLocatarioDto: UpdateLocatarioDto) {
    await this.findOne(id);

    return this.prisma.locatario.update({
      where: { id },
      data: updateLocatarioDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.locatario.delete({
      where: { id },
    });
  }
}