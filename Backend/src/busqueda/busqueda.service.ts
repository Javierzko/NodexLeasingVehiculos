import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type TipoBusqueda = 'contrato' | 'placa' | 'nit';

@Injectable()
export class BusquedaService {
  constructor(private readonly prisma: PrismaService) {}

  async buscar(tipo: TipoBusqueda, q: string) {
    const termino = q.trim();

    if (!termino) {
      throw new BadRequestException('El término de búsqueda no puede estar vacío');
    }

    // AQUÍ ESTÁ EL CAMBIO: le asignamos el tipo 'any' inicializado en null
    let resultado: any = null;

    switch (tipo) {
      case 'contrato':
        resultado = await this.prisma.caso.findFirst({
          where: { numeroContrato: { equals: termino, mode: 'insensitive' } },
          include: {
            vehiculo: true,
            locatario: true,
          },
        });
        break;

      case 'placa':
        resultado = await this.prisma.vehiculo.findFirst({
          where: { placa: { equals: termino, mode: 'insensitive' } },
        });
        break;

      case 'nit':
        resultado = await this.prisma.locatario.findFirst({
          where: { nit: { equals: termino, mode: 'insensitive' } },
        });
        break;

      default:
        throw new BadRequestException(`Tipo de búsqueda no válido: ${tipo}`);
    }

    return {
      tipo,
      busqueda: termino,
      encontrado: !!resultado,
      data: resultado,
    };
  }
}