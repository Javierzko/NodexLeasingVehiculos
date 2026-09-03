import {
  Body,
  Controller,
  Patch,
} from '@nestjs/common';
import { GestionMasivaService } from './gestion-masiva.service';
import { CambiarEstadoMasivoDto } from './dto/cambiar-estado-masivo.dto';

@Controller('gestion-masiva')
export class GestionMasivaController {
  constructor(
    private readonly gestionMasivaService: GestionMasivaService,
  ) {}

  @Patch('estado')
  cambiarEstadoMasivo(
    @Body() dto: CambiarEstadoMasivoDto,
  ) {
    return this.gestionMasivaService.cambiarEstadoMasivo(dto);
  }
}