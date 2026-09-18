// src/calculos2/calculos2.controller.ts

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Calculos2Service } from './calculos2.service';

@Controller('calculos2')
export class Calculos2Controller {
  constructor(private readonly calculos2Service: Calculos2Service) {}

  @Get(':casoId')
  async obtenerCalculos(@Param('casoId', ParseIntPipe) casoId: number) {
    return this.calculos2Service.calcularCasoV2(casoId);
  }
}