// raiz/src/inyeccionMasiva/auto-inyeccion-casos.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { AutoInyeccionCasosService } from '../auto-InyeccionCasos/auto-inyeccion-casos.service';
import { AutoInyeccionCasosDto } from '../dto/auto-inyeccion-casos.dto';

@Controller('auto-inyeccion-casos')
export class AutoInyeccionCasosController {
  constructor(
    private readonly autoInyeccionCasosService: AutoInyeccionCasosService,
  ) {}

  @Post('importar')
  importar(@Body() dto: AutoInyeccionCasosDto) {
    return this.autoInyeccionCasosService.importarCasos(dto);
  }
}