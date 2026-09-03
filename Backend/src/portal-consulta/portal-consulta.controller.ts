// src/portal-consulta/portal-consulta.controller.ts

import { Body, Controller, Post } from '@nestjs/common';
import { ConsultarPortalDto } from './dto/consultar-portal.dto';
import { PortalConsultaService } from './portal-consulta.service';

@Controller('portal-consulta')
export class PortalConsultaController {
  constructor(private readonly portalConsultaService: PortalConsultaService) {}

  @Post()
  consultar(@Body() dto: ConsultarPortalDto) {
    return this.portalConsultaService.consultar(dto);
  }
}