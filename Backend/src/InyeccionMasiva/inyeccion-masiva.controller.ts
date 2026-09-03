// raiz src/inyeccionMasiva /inyeccionmasivaController


import { Body, Controller, Post } from '@nestjs/common';
import { InyeccionMasivaService } from './inyeccion-masiva.service';
import { ImportarVehiculosDto } from './importar-vehiculos.dto';

@Controller('inyeccion-masiva')
export class InyeccionMasivaController {
  constructor(
    private readonly inyeccionMasivaService: InyeccionMasivaService,
  ) {}

  @Post('vehiculos')
  importarVehiculos(@Body() dto: ImportarVehiculosDto) {
    return this.inyeccionMasivaService.importarVehiculos(dto);
  }
}
