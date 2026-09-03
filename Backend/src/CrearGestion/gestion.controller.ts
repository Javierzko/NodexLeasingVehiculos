// razi src/CrearGestion/GestionController.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { GestionService } from './gestion.service';

import type { TipoBusquedaGestion } from './gestion.service';

import { CreateGestionDto } from './CreateGestionDto';

@Controller('gestion')
export class GestionController {

  constructor(private readonly gestionService: GestionService) {}

  // Crear nueva gestión

  @Post()
  async crearGestion(@Body() dto: CreateGestionDto) {
    return this.gestionService.crearGestion(dto);
  }

  // Buscar casos para registrar una gestión

  @Get('buscar')
  async buscarCasos(
    @Query('tipo') tipo: TipoBusquedaGestion,
    @Query('q') q: string,
  ) {
    return this.gestionService.buscarCasos(tipo, q);
  }

  // Obtener historial de gestiones de un caso

  @Get(':casoId/gestiones')
  async obtenerHistorialGestiones(
    @Param('casoId', ParseIntPipe) casoId: number,
  ) {
    return this.gestionService.obtenerHistorialGestiones(casoId);
  }

}