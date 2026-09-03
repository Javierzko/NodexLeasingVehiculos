import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { BusquedaService } from './busqueda.service';
import type { TipoBusqueda } from './busqueda.service'; // <-- Cambio aquí: 'import type'

@Controller('busqueda')
export class BusquedaController {
  constructor(private readonly busquedaService: BusquedaService) {}

  @Get()
  async buscar(
    @Query('tipo') tipo: TipoBusqueda,
    @Query('q') q: string,
  ) {
    if (!tipo || !q) {
      throw new BadRequestException('Se requieren los parámetros "tipo" y "q"');
    }

    return this.busquedaService.buscar(tipo, q);
  }
}