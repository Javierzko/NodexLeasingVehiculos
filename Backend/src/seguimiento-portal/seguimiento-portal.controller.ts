import { Body, Controller, Post } from '@nestjs/common';
import { ConsultarSeguimientoDto } from './dto/consultar-seguimiento.dto';
import { SeguimientoPortalService } from './seguimiento-portal.service';

@Controller('seguimiento-portal')
export class SeguimientoPortalController {
  constructor(
    private readonly seguimientoPortalService: SeguimientoPortalService,
  ) {}

  @Post()
  consultar(@Body() dto: ConsultarSeguimientoDto) {
    return this.seguimientoPortalService.consultar(dto);
  }
}
