import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CalculosService } from './calculos.service';

@Controller('calculos')
export class CalculosController {
  constructor(private readonly calculosService: CalculosService) {}

  @Get(':casoId')
  async obtenerCalculosCaso(@Param('casoId', ParseIntPipe) casoId: number) {
    return await this.calculosService.calcularCaso(casoId);
  }
}