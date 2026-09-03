import { Body, Controller, Post } from '@nestjs/common';
import { CargaCasosService } from './carga-casos.service';
import { ImportarCasosDto } from './importar-casos.dto';

@Controller('inyeccion-masiva')
export class CargaCasosController {
  constructor(private readonly cargaCasosService: CargaCasosService) {}

  @Post('casos')
  importarCasos(@Body() dto: ImportarCasosDto) {
    return this.cargaCasosService.importarCasos(dto);
  }
}
